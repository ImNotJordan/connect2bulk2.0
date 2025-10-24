import React, { useEffect, useState, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { FaClock, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

interface LoadWithTracking {
  id: string;
  load_number: string;
  status?: string | null;
  origin: string;
  destination: string;
  pickup_date: string;
  delivery_date?: string | null;
  driver_name?: string | null;
  customer_name?: string | null;
  lastEvent?: {
    event_type?: string | null;
    location?: string | null;
    eta?: string | null;
    delay_minutes?: number | null;
    created_at?: string | null;
  };
  riskScore?: {
    risk_level?: string | null;
    score?: number | null;
  };
  ar?: {
    amount?: number | null;
    status?: string | null;
    days_outstanding?: number | null;
  };
  updated_at?: string | null;
}

const RealtimeLoadsList: React.FC = () => {
  const client = useMemo(() => generateClient<Schema>(), []);
  const [loads, setLoads] = useState<LoadWithTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const lastUpdateRef = useRef<Map<string, number>>(new Map());
  const etaUpdateTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch initial data and set up real-time subscriptions
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch loads with status IN_TRANSIT, BOOKED, or TENDERED
        const { data: loadsData } = await client.models.Load.list({
          limit: 50,
        });

        if (!isMounted) return;

        // Fetch related data for each load
        const enrichedLoads = await Promise.all(
          (loadsData || []).map(async (load) => {
            const [trackingEvents, riskScores, arRecords] = await Promise.all([
              client.models.TrackingEvent.list({
                filter: { load_id: { eq: load.id } },
                limit: 1,
              }),
              client.models.RiskScore.list({
                filter: { load_id: { eq: load.id } },
                limit: 1,
              }),
              client.models.AccountsReceivable.list({
                filter: { load_id: { eq: load.id } },
                limit: 1,
              }),
            ]);

            const lastEvent = trackingEvents.data?.[0];
            const riskScore = riskScores.data?.[0];
            const ar = arRecords.data?.[0];

            return {
              id: load.id,
              load_number: load.load_number || '',
              status: load.status,
              origin: load.origin || '',
              destination: load.destination || '',
              pickup_date: load.pickup_date || '',
              delivery_date: load.delivery_date,
              driver_name: load.driver_name,
              customer_name: load.customer_name,
              lastEvent: lastEvent ? {
                event_type: lastEvent.event_type,
                location: lastEvent.location,
                eta: lastEvent.eta,
                delay_minutes: lastEvent.delay_minutes,
                created_at: lastEvent.created_at,
              } : undefined,
              riskScore: riskScore ? {
                risk_level: riskScore.risk_level,
                score: riskScore.score,
              } : undefined,
              ar: ar ? {
                amount: ar.amount,
                status: ar.status,
                days_outstanding: ar.days_outstanding,
              } : undefined,
              updated_at: load.updated_at,
            };
          })
        );

        if (isMounted) {
          setLoads(enrichedLoads);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching loads:', error);
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    // Subscribe to Load updates - updates within 5s
    const loadSubscription = client.models.Load.observeQuery().subscribe({
      next: ({ items }) => {
        if (!isMounted) return;
        
        const now = Date.now();
        const updatedLoads = items.map((load) => {
          const existing = loads.find((l) => l.id === load.id);
          const lastUpdate = lastUpdateRef.current.get(load.id) || 0;
          
          // Check if this is a new update (within last 5 seconds)
          if (now - lastUpdate < 5000 && existing) {
            return existing;
          }
          
          lastUpdateRef.current.set(load.id, now);
          
          return {
            id: load.id,
            load_number: load.load_number || '',
            status: load.status,
            origin: load.origin || '',
            destination: load.destination || '',
            pickup_date: load.pickup_date || '',
            delivery_date: load.delivery_date,
            driver_name: load.driver_name,
            customer_name: load.customer_name,
            lastEvent: existing?.lastEvent,
            riskScore: existing?.riskScore,
            ar: existing?.ar,
            updated_at: load.updated_at,
          };
        });
        
        setLoads(updatedLoads);
      },
      error: (error) => console.error('Load subscription error:', error),
    });

    // Subscribe to TrackingEvent updates - ETA/delay badges within 30s
    const trackingSubscription = client.models.TrackingEvent.observeQuery().subscribe({
      next: ({ items }) => {
        if (!isMounted) return;
        
        // Update ETA badges with 30s delay handling
        etaUpdateTimerRef.current = setTimeout(() => {
          setLoads((prevLoads) =>
            prevLoads.map((load) => {
              const event = items.find((e) => e.load_id === load.id);
              if (event) {
                return {
                  ...load,
                  lastEvent: {
                    event_type: event.event_type,
                    location: event.location,
                    eta: event.eta,
                    delay_minutes: event.delay_minutes,
                    created_at: event.created_at,
                  },
                };
              }
              return load;
            })
          );
        }, 30000); // 30s delay for ETA/delay badge rendering
      },
      error: (error) => console.error('Tracking subscription error:', error),
    });

    return () => {
      isMounted = false;
      loadSubscription.unsubscribe();
      trackingSubscription.unsubscribe();
      if (etaUpdateTimerRef.current) {
        clearTimeout(etaUpdateTimerRef.current);
      }
    };
  }, [client]);

  const getStatusBadge = (status?: string | null) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      POSTED: { color: '#6c757d', label: 'Posted' },
      QUOTED: { color: '#17a2b8', label: 'Quoted' },
      TENDERED: { color: '#ffc107', label: 'Tendered' },
      BOOKED: { color: '#28a745', label: 'Booked' },
      IN_TRANSIT: { color: '#007bff', label: 'In Transit' },
      DELIVERED: { color: '#6f42c1', label: 'Delivered' },
      INVOICED: { color: '#fd7e14', label: 'Invoiced' },
      PAID: { color: '#28a745', label: 'Paid' },
    };
    
    const config = statusMap[status || 'POSTED'] || statusMap.POSTED;
    return <StatusBadge color={config.color}>{config.label}</StatusBadge>;
  };

  const getDelayBadge = (delay_minutes?: number | null) => {
    if (!delay_minutes || delay_minutes <= 0) return null;
    
    return (
      <DelayBadge severity={delay_minutes > 60 ? 'high' : 'medium'}>
        <FaExclamationTriangle /> Delayed {delay_minutes}min
      </DelayBadge>
    );
  };

  const getETABadge = (eta?: string | null) => {
    if (!eta) return null;
    
    const etaDate = new Date(eta);
    const now = new Date();
    const hoursUntil = Math.round((etaDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    return (
      <ETABadge>
        <FaClock /> ETA: {hoursUntil}h
      </ETABadge>
    );
  };

  const getRiskBadge = (riskLevel?: string | null) => {
    if (!riskLevel) return null;
    
    const riskMap: Record<string, { color: string; icon: React.ReactElement }> = {
      LOW: { color: '#28a745', icon: <FaCheckCircle /> },
      MEDIUM: { color: '#ffc107', icon: <FaClock /> },
      HIGH: { color: '#fd7e14', icon: <FaExclamationTriangle /> },
      CRITICAL: { color: '#dc3545', icon: <FaExclamationTriangle /> },
    };
    
    const config = riskMap[riskLevel] || riskMap.LOW;
    return (
      <RiskBadge color={config.color}>
        {config.icon} {riskLevel}
      </RiskBadge>
    );
  };

  if (loading) {
    return <LoadingText>Loading loads...</LoadingText>;
  }

  if (loads.length === 0) {
    return <EmptyText>No active loads found</EmptyText>;
  }

  return (
    <Container>
      <Header>
        <Title>Active Loads</Title>
        <Count>{loads.length} loads</Count>
      </Header>
      
      <LoadsTable>
        <thead>
          <tr>
            <Th>Load #</Th>
            <Th>Status</Th>
            <Th>Route</Th>
            <Th>Driver</Th>
            <Th>Customer</Th>
            <Th>Tracking</Th>
            <Th>Risk</Th>
            <Th>AR Status</Th>
          </tr>
        </thead>
        <tbody>
          {loads.map((load) => (
            <tr key={load.id}>
              <Td>
                <LoadNumber>{load.load_number}</LoadNumber>
              </Td>
              <Td>{getStatusBadge(load.status)}</Td>
              <Td>
                <RouteInfo>
                  <RouteText>{load.origin}</RouteText>
                  <RouteArrow>→</RouteArrow>
                  <RouteText>{load.destination}</RouteText>
                </RouteInfo>
              </Td>
              <Td>{load.driver_name || '-'}</Td>
              <Td>{load.customer_name || '-'}</Td>
              <Td>
                <BadgesContainer>
                  {getETABadge(load.lastEvent?.eta)}
                  {getDelayBadge(load.lastEvent?.delay_minutes)}
                  {load.lastEvent?.location && (
                    <LocationText>📍 {load.lastEvent.location}</LocationText>
                  )}
                </BadgesContainer>
              </Td>
              <Td>{getRiskBadge(load.riskScore?.risk_level)}</Td>
              <Td>
                {load.ar && (
                  <ARInfo>
                    <ARAmount>${load.ar.amount?.toFixed(2)}</ARAmount>
                    {load.ar.days_outstanding && load.ar.days_outstanding > 30 && (
                      <OverdueText>{load.ar.days_outstanding}d overdue</OverdueText>
                    )}
                  </ARInfo>
                )}
                {!load.ar && '-'}
              </Td>
            </tr>
          ))}
        </tbody>
      </LoadsTable>
    </Container>
  );
};

const Container = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(40, 44, 69, 0.1);
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  margin: 0;
  color: #2a2f45;
  font-size: 18px;
  font-weight: 600;
`;

const Count = styled.span`
  color: #6c757d;
  font-size: 14px;
`;

const LoadsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 8px;
  border-bottom: 2px solid #e9ecef;
  color: #6c757d;
  font-size: 13px;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 12px 8px;
  border-bottom: 1px solid #f1f3f5;
  font-size: 14px;
  color: #2a2f45;
`;

const LoadNumber = styled.span`
  font-weight: 600;
  color: #667eea;
`;

const StatusBadge = styled.span<{ color: string }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background-color: ${(props) => props.color};
`;

const RouteInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
`;

const RouteText = styled.span`
  color: #2a2f45;
`;

const RouteArrow = styled.span`
  color: #6c757d;
`;

const BadgesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ETABadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  background-color: #e3f2fd;
  color: #1976d2;
  width: fit-content;
`;

const DelayBadge = styled.span<{ severity: 'medium' | 'high' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  background-color: ${(props) => (props.severity === 'high' ? '#ffebee' : '#fff3e0')};
  color: ${(props) => (props.severity === 'high' ? '#c62828' : '#e65100')};
  width: fit-content;
`;

const RiskBadge = styled.span<{ color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background-color: ${(props) => props.color};
`;

const LocationText = styled.div`
  font-size: 11px;
  color: #6c757d;
`;

const ARInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ARAmount = styled.span`
  font-weight: 600;
  color: #2a2f45;
`;

const OverdueText = styled.span`
  font-size: 11px;
  color: #dc3545;
  font-weight: 600;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 40px;
  color: #6c757d;
  font-size: 14px;
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 40px;
  color: #6c757d;
  font-size: 14px;
`;

export default RealtimeLoadsList;
