import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../../amplify/data/resource';
import { Icon } from '@iconify-icon/react';

const UnbilledLoads: React.FC = () => {
  const [loads, setLoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Amplify client after configuration
  const client = useMemo(() => generateClient<Schema>(), []);

  useEffect(() => {
    fetchUnbilledLoads();
  }, []);

  const fetchUnbilledLoads = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all loads - in a real system, you'd filter by a 'billed' status field
      const result = await client.models.Load.list({
        limit: 100
      });

      if (result.data) {
        // Filter for unbilled loads (you can add a 'billing_status' field to your schema)
        // For now, showing all loads as an example
        setLoads(result.data);
      }
    } catch (err) {
      setError('Failed to load unbilled loads');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total unbilled amount
  const totalUnbilled = useMemo(() => {
    return loads.reduce((sum, load) => {
      const rate = load.rate ? parseFloat(load.rate.toString()) : 0;
      return sum + rate;
    }, 0);
  }, [loads]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <Icon icon="mdi:loading" className="spin" width="32" />
          <LoadingText>Loading unbilled loads...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <Icon icon="mdi:alert-circle" width="32" color="#dc2626" />
          <ErrorText>{error}</ErrorText>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Title>Unbilled Loads</Title>
          <Subtitle>{loads.length} load{loads.length !== 1 ? 's' : ''} awaiting billing</Subtitle>
        </HeaderLeft>
        <TotalCard>
          <TotalLabel>Total Unbilled</TotalLabel>
          <TotalAmount>{formatCurrency(totalUnbilled)}</TotalAmount>
        </TotalCard>
      </Header>

      {loads.length === 0 ? (
        <EmptyState>
          <Icon icon="mdi:check-circle" width="48" color="#10b981" />
          <EmptyTitle>All Caught Up!</EmptyTitle>
          <EmptyText>No unbilled loads at the moment</EmptyText>
        </EmptyState>
      ) : (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>Load #</Th>
                <Th>Pickup Date</Th>
                <Th>Origin</Th>
                <Th>Destination</Th>
                <Th>Miles</Th>
                <Th align="right">Rate</Th>
                <Th align="center">Status</Th>
              </tr>
            </thead>
            <tbody>
              {loads.map((load) => (
                <Tr key={load.id}>
                  <Td>
                    <LoadNumber>{load.load_number || 'N/A'}</LoadNumber>
                  </Td>
                  <Td>{load.pickup_date ? formatDate(load.pickup_date) : 'N/A'}</Td>
                  <Td>
                    <Location>{load.origin || 'Unknown'}</Location>
                  </Td>
                  <Td>
                    <Location>{load.destination || 'Unknown'}</Location>
                  </Td>
                  <Td>{load.miles ? `${load.miles} mi` : '-'}</Td>
                  <Td align="right">
                    <Rate>{load.rate ? formatCurrency(parseFloat(load.rate.toString())) : '-'}</Rate>
                  </Td>
                  <Td align="center">
                    <StatusBadge status="unbilled">
                      <Icon icon="mdi:alert-circle-outline" width="14" />
                      Unbilled
                    </StatusBadge>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}
    </Container>
  );
};

export default UnbilledLoads;

// Styled Components
const Container = styled.div`
  width: 100%;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin: 0;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 14px;
  margin: 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
`;

const TotalCard = styled.div`
  background: linear-gradient(135deg, #1f2640 0%, #2a3456 100%);
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(31, 38, 64, 0.15);
  min-width: 200px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TotalLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

const TotalAmount = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 12px;
`;

const EmptyTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
`;

const EmptyText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
`;

const TableWrapper = styled.div`
  border: 1px solid rgba(40, 44, 69, 0.08);
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th<{ align?: string }>`
  text-align: ${(props) => props.align || 'left'};
  padding: 12px 16px;
  background: #f9fafb;
  color: #374151;
  font-weight: 600;
  font-size: 13px;
  border-bottom: 1px solid rgba(40, 44, 69, 0.08);
  white-space: nowrap;
`;

const Tr = styled.tr`
  &:hover {
    background: #f9fafb;
  }

  &:not(:last-child) td {
    border-bottom: 1px solid rgba(40, 44, 69, 0.04);
  }
`;

const Td = styled.td<{ align?: string }>`
  text-align: ${(props) => props.align || 'left'};
  padding: 12px 16px;
  color: #4b5563;
  font-size: 13px;
`;

const LoadNumber = styled.span`
  font-weight: 600;
  color: #1f2937;
`;

const Location = styled.span`
  color: #4b5563;
`;

const Rate = styled.span`
  font-weight: 600;
  color: #059669;
`;

const StatusBadge = styled.div<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${(props) =>
    props.status === 'unbilled' ? '#fef3c7' : '#e5e7eb'};
  color: ${(props) =>
    props.status === 'unbilled' ? '#92400e' : '#374151'};
`;
