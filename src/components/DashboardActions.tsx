import React from 'react';
import styled from 'styled-components';
import { FaFileInvoice, FaGavel, FaPhone, FaTruck, FaBell } from 'react-icons/fa';

interface DashboardActionsProps {
  onCreateQuote: () => void;
  onStartTender: () => void;
  onCallDriver: () => void;
  onLaunchCollection: () => void;
  onPostUpdate: () => void;
}

const DashboardActions: React.FC<DashboardActionsProps> = ({
  onCreateQuote,
  onStartTender,
  onCallDriver,
  onLaunchCollection,
  onPostUpdate,
}) => {
  return (
    <ActionsContainer>
      <SectionTitle>Quick Actions</SectionTitle>
      <ActionsGrid>
        <ActionButton onClick={onCreateQuote}>
          <ActionIcon>
            <FaFileInvoice />
          </ActionIcon>
          <ActionLabel>Create Quote</ActionLabel>
        </ActionButton>
        
        <ActionButton onClick={onStartTender}>
          <ActionIcon>
            <FaGavel />
          </ActionIcon>
          <ActionLabel>Start Tender</ActionLabel>
        </ActionButton>
        
        <ActionButton onClick={onCallDriver}>
          <ActionIcon>
            <FaPhone />
          </ActionIcon>
          <ActionLabel>Call/Text Driver</ActionLabel>
        </ActionButton>
        
        <ActionButton onClick={onLaunchCollection}>
          <ActionIcon>
            <FaTruck />
          </ActionIcon>
          <ActionLabel>Launch Collection</ActionLabel>
        </ActionButton>
        
        <ActionButton onClick={onPostUpdate}>
          <ActionIcon>
            <FaBell />
          </ActionIcon>
          <ActionLabel>Post Update</ActionLabel>
        </ActionButton>
      </ActionsGrid>
    </ActionsContainer>
  );
};

const ActionsContainer = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-weight: 600;
  color: #2a2f45;
  font-size: clamp(16px, 2.2vw, 18px);
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #dc143c, #a00e2b);
  border: none;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ActionIcon = styled.div`
  color: white;
  font-size: 24px;
`;

const ActionLabel = styled.span`
  color: white;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
`;

export default DashboardActions;
