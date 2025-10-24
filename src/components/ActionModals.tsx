import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export const CreateQuoteModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [loadNumber, setLoadNumber] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [rate, setRate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement quote creation logic
    console.log('Creating quote:', { loadNumber, origin, destination, rate });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Quote">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Load Number</Label>
          <Input
            type="text"
            value={loadNumber}
            onChange={(e) => setLoadNumber(e.target.value)}
            placeholder="Enter load number"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Origin</Label>
          <Input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Origin location"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Destination</Label>
          <Input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destination location"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Rate ($)</Label>
          <Input
            type="number"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="Quote rate"
            required
          />
        </FormGroup>
        <ButtonGroup>
          <SecondaryButton type="button" onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit">Create Quote</PrimaryButton>
        </ButtonGroup>
      </Form>
    </Modal>
  );
};

export const StartTenderModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [loadId, setLoadId] = useState('');
  const [carriers, setCarriers] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement tender logic
    console.log('Starting tender:', { loadId, carriers, deadline });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Start Tender">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Load ID</Label>
          <Input
            type="text"
            value={loadId}
            onChange={(e) => setLoadId(e.target.value)}
            placeholder="Select load"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Target Carriers</Label>
          <TextArea
            value={carriers}
            onChange={(e) => setCarriers(e.target.value)}
            placeholder="Enter carrier names (comma-separated)"
            rows={3}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Response Deadline</Label>
          <Input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </FormGroup>
        <ButtonGroup>
          <SecondaryButton type="button" onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit">Start Tender</PrimaryButton>
        </ButtonGroup>
      </Form>
    </Modal>
  );
};

export const CallDriverModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [driverPhone, setDriverPhone] = useState('');
  const [message, setMessage] = useState('');
  const [method, setMethod] = useState<'call' | 'text'>('call');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement call/text driver logic
    console.log('Contacting driver:', { driverPhone, message, method });
    if (method === 'call') {
      window.open(`tel:${driverPhone}`);
    } else {
      window.open(`sms:${driverPhone}?body=${encodeURIComponent(message)}`);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact Driver">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Driver Phone</Label>
          <Input
            type="tel"
            value={driverPhone}
            onChange={(e) => setDriverPhone(e.target.value)}
            placeholder="+1 (555) 123-4567"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Contact Method</Label>
          <RadioGroup>
            <RadioLabel>
              <input
                type="radio"
                value="call"
                checked={method === 'call'}
                onChange={() => setMethod('call')}
              />
              Call
            </RadioLabel>
            <RadioLabel>
              <input
                type="radio"
                value="text"
                checked={method === 'text'}
                onChange={() => setMethod('text')}
              />
              Text Message
            </RadioLabel>
          </RadioGroup>
        </FormGroup>
        {method === 'text' && (
          <FormGroup>
            <Label>Message</Label>
            <TextArea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              required
            />
          </FormGroup>
        )}
        <ButtonGroup>
          <SecondaryButton type="button" onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit">
            {method === 'call' ? 'Call Driver' : 'Send Text'}
          </PrimaryButton>
        </ButtonGroup>
      </Form>
    </Modal>
  );
};

export const LaunchCollectionModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [amountDue, setAmountDue] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement collection logic
    console.log('Launching collection:', { invoiceNumber, amountDue, customerEmail });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Launch Collection">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Invoice Number</Label>
          <Input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="INV-12345"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Amount Due ($)</Label>
          <Input
            type="number"
            step="0.01"
            value={amountDue}
            onChange={(e) => setAmountDue(e.target.value)}
            placeholder="0.00"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Customer Email</Label>
          <Input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="customer@example.com"
            required
          />
        </FormGroup>
        <ButtonGroup>
          <SecondaryButton type="button" onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit">Send Collection Notice</PrimaryButton>
        </ButtonGroup>
      </Form>
    </Modal>
  );
};

export const PostUpdateModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [loadNumber, setLoadNumber] = useState('');
  const [updateType, setUpdateType] = useState<'status' | 'delay' | 'eta'>('status');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement update posting logic
    console.log('Posting update:', { loadNumber, updateType, message });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post Update to Customer">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Load Number</Label>
          <Input
            type="text"
            value={loadNumber}
            onChange={(e) => setLoadNumber(e.target.value)}
            placeholder="Select load"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Update Type</Label>
          <Select value={updateType} onChange={(e) => setUpdateType(e.target.value as any)}>
            <option value="status">Status Update</option>
            <option value="delay">Delay Notification</option>
            <option value="eta">ETA Change</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>Message</Label>
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Update details for customer..."
            rows={5}
            required
          />
        </FormGroup>
        <ButtonGroup>
          <SecondaryButton type="button" onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit">Send Update</PrimaryButton>
        </ButtonGroup>
      </Form>
    </Modal>
  );
};

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #2a2f45;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #2a2f45;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #2a2f45;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #2a2f45;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const PrimaryButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled.button`
  padding: 10px 20px;
  background: white;
  color: #6c757d;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f8f9fa;
    border-color: #6c757d;
  }
`;
