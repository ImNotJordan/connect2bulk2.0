import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import FolderTabs from '../../components/FolderTabs';
import { Icon } from '@iconify-icon/react';
import { generateClient } from 'aws-amplify/data';
import { fetchAuthSession } from 'aws-amplify/auth';
import type { Schema } from '../../../amplify/data/resource';
import { useAlert } from '../../components/AlertProvider';
import AllFirmTrucks from './tabs/AllFirmTrucks';
import MyTrucks from './tabs/MyTrucks';
import { TRAILER_TYPES_SET, toAllCaps } from './constants';

const TruckBoard: React.FC = () => {
  // Amplify Data client
  const client = useMemo(() => generateClient<Schema>(), []);
  const { info, warning } = useAlert();

  // Listing refresh + optimistic lastCreated
  const [refreshToken, setRefreshToken] = useState(0);
  const [lastCreated, setLastCreated] = useState<any | null>(null);
  const [trucks, setTrucks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const incrementRefreshToken = () => setRefreshToken((v) => v + 1);

  // ✅ Load cached trucks on mount
  useEffect(() => {
    const cached = sessionStorage.getItem('trucks');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setTrucks(parsed);
          setLoading(false);
        }
      } catch (_) {
        // ignore parse errors
      }
    }
  }, []);

  // Fetch trucks from backend
  const fetchTrucks = async () => {
    try {
      setLoading(true);
      console.log('Fetching trucks from backend...');
      const result = await client.models.Truck.list();
      console.log('Fetched trucks:', result);
      if (result.data) {
        setTrucks(result.data);
        // ✅ cache in sessionStorage
        sessionStorage.setItem('trucks', JSON.stringify(result.data));
      }
    } catch (err) {
      console.error('Error fetching trucks:', err);
      setError('Failed to load trucks. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch trucks only if no cache or on manual refresh, and set up auto-refresh
  useEffect(() => {
    if (refreshToken > 0) {
      fetchTrucks();
    } else {
      // First mount: only fetch if no cache present
      const cached = sessionStorage.getItem('trucks');
      if (!cached) {
        fetchTrucks();
      }
    }
    
    // Set up interval to fetch every minute (60000ms)
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing trucks...');
      fetchTrucks();
    }, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [refreshToken]);

  // Add Truck modal state
  const [isAddOpen, setAddOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    truck_number: '',
    available_date: '',
    origin: '',
    destination_preference: '',
    trailer_type: '',
    equipment: '',
    length_ft: '',
    weight_capacity: '',
    comment: '',
  });

  // Generate a unique random truck number
  const generateTruckNumber = () => {
    const prefix = 'TN';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${timestamp}-${random}`;
  };

  // Date picker ref and opener
  const availableDateRef = useRef<HTMLInputElement | null>(null);
  const openDatePicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    const el = ref.current as any;
    try {
      if (el?.showPicker) {
        el.showPicker();
        return;
      }
    } catch (_) {}
    ref.current?.focus();
  };

  // Initialize form with a random truck number when modal opens
  useEffect(() => {
    if (isAddOpen) {
      setForm((prev) => ({ ...prev, truck_number: generateTruckNumber() }));
    }
  }, [isAddOpen]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'available_date') {
      const parts = value.split('-');
      if (parts[0] && parts[0].length > 4) parts[0] = parts[0].slice(0, 4);
      const sanitized = parts.join('-');
      setForm((prev) => ({ ...prev, [name]: sanitized }));
      return;
    }
    if (name === 'trailer_type') {
      setForm((prev) => ({ ...prev, trailer_type: toAllCaps(value) }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    if (adding) return;
    setError(null);
    setAddOpen(false);
  };

  const onCancel = () => {
    if (adding) return;
    const { close } = warning({
      title: 'Discard this truck post?',
      message: 'Your changes will be lost.',
      autoClose: false,
      position: 'top-right',
      action: (
        <ToastActionRow>
          <ToastPrimaryBtn
            type="button"
            onClick={() => {
              close();
              closeModal();
              info({
                title: 'Cancelled',
                message: 'Post Truck was cancelled.',
                autoClose: true,
                autoCloseDuration: 3500,
                position: 'top-right',
              });
            }}
          >
            Discard
          </ToastPrimaryBtn>
          <ToastSecondaryBtn type="button" onClick={() => close()}>
            Keep Editing
          </ToastSecondaryBtn>
        </ToastActionRow>
      ),
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAdding(true);

    try {
      // Get the current authenticated user from Auth
      const { getCurrentUser } = await import('aws-amplify/auth');
      const { username, userId } = await getCurrentUser();
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      console.log('Current user ID:', userId);
      console.log('Current username:', username);

      const truckInput = {
        truck_number: form.truck_number.trim() || `T-${Date.now()}`,
        available_date: form.available_date?.trim() || null,
        origin: form.origin?.trim() || null,
        destination_preference: form.destination_preference?.trim() || null,
        trailer_type: form.trailer_type?.trim() || null,
        equipment: form.equipment?.trim() || null,
        length_ft: form.length_ft ? parseInt(form.length_ft, 10) : null,
        weight_capacity: form.weight_capacity ? parseFloat(form.weight_capacity) : null,
        comment: form.comment?.trim() || null,
        created_at: new Date().toISOString()
      };
      
      console.log('Creating truck with input:', truckInput);

      const { data: createdTruck, errors } = await client.models.Truck.create(truckInput, {
        authMode: 'userPool',
        authToken: (await fetchAuthSession()).tokens?.idToken?.toString(),
      });
      
      if (errors && errors.length > 0) {
        console.error('Error details:', errors);
        throw new Error(errors[0]?.message || 'Failed to create truck');
      }

      if (!createdTruck) {
        throw new Error('No data returned from truck creation');
      }

      console.log('Truck created successfully:', createdTruck);
      setLastCreated(createdTruck);
      setTrucks((prev) => {
        const updated = [createdTruck, ...prev];
        sessionStorage.setItem('trucks', JSON.stringify(updated));
        return updated;
      });
      incrementRefreshToken();
      closeModal();
    } catch (err) {
      console.error('Error creating truck:', err);
      setError('Failed to create truck. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole('SUPER_MANAGER');
  }, []);

  const handleDeleteTruck = async (truckId: string) => {
    try {
      await client.models.Truck.delete({ id: truckId });
      
      // Update local state
      setTrucks(prev => prev.filter(truck => truck.id !== truckId));
      
      // Update session storage
      const cached = sessionStorage.getItem('trucks');
      if (cached) {
        const parsed = JSON.parse(cached);
        const updated = parsed.filter((t: any) => t.id !== truckId);
        sessionStorage.setItem('trucks', JSON.stringify(updated));
      }
      
      // Show success toast
      info({
        title: 'Success',
        message: 'Truck deleted successfully',
        autoClose: true,
        autoCloseDuration: 3000,
        position: 'top-right',
      });
    } catch (error) {
      console.error('Error deleting truck:', error);
      // Show error toast
      info({
        title: 'Error',
        message: 'Failed to delete truck. Please try again.',
        autoClose: true,
        autoCloseDuration: 5000,
        position: 'top-right',
      });
    }
  };

  return (
    <Page>
      <Content>
        <FolderTabs
          ariaLabel="Truckboard Sections"
          idPrefix="truckboard"
          tabs={[
            {
              id: 'posted',
              label: 'All Trucks',
              content: (
                <AllFirmTrucks
                  key={`all-firm-trucks-${refreshToken}`}
                  onAddNewTruck={() => setAddOpen(true)}
                  refreshToken={refreshToken}
                  lastCreated={lastCreated}
                  trucks={trucks}
                  loading={loading}
                  error={error}
                  userRole={userRole}
                  onDeleteTruck={handleDeleteTruck}
                />
              ),
            },
            {
              id: 'search',
              label: 'Search Trucks',
              content: (
                <>
                  <PanelTitle>Search Trucks</PanelTitle>
                  <PanelText>Search interface and results for trucks will appear here.</PanelText>
                </>
              ),
            },
            {
              id: 'my',
              label: 'My Trucks',
              content: (
                <MyTrucks
                  onAddNewTruck={() => setAddOpen(true)}
                  lastCreated={lastCreated}
                  trucks={trucks}
                  loading={loading}
                  error={error}
                  onDeleteTruck={handleDeleteTruck}
                />
              ),
            },
          ]}
          brand={
            <Brand>
              <PageName>Truckboard</PageName>
              <Logo src="/logo128.png" alt="Connect2Bulk" />
            </Brand>
          }
        />

        {isAddOpen && (
          <ModalOverlay role="dialog" aria-modal="true" onClick={closeModal}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>Post Truck</ModalTitle>
                <CloseBtn type="button" onClick={closeModal} aria-label="Close">
                  <Icon icon="mdi:close" />
                </CloseBtn>
              </ModalHeader>
              <form onSubmit={handleCreate}>
                <FormGrid>
                  <Field>
                    <FormLabel htmlFor="truck_number">Truck Number</FormLabel>
                    <TextInput
                      id="truck_number"
                      name="truck_number"
                      value={form.truck_number}
                      onChange={onChange}
                      readOnly
                      required
                    />
                  </Field>
                  
                  <Field>
                    <FormLabel htmlFor="available_date">Available Date</FormLabel>
                    <DateFieldRow>
                      <TextInput
                        ref={availableDateRef}
                        id="available_date"
                        name="available_date"
                        type="date"
                        value={form.available_date}
                        onChange={onChange}
                        required
                      />
                      <CalendarBtn 
                        type="button" 
                        onClick={() => openDatePicker(availableDateRef)}
                        aria-label="Open date picker"
                      >
                        <Icon icon="mdi:calendar" />
                      </CalendarBtn>
                    </DateFieldRow>
                  </Field>

                  <Field>
                    <FormLabel htmlFor="origin">Origin (City, ST)</FormLabel>
                    <TextInput
                      id="origin"
                      name="origin"
                      value={form.origin}
                      onChange={onChange}
                      placeholder="e.g. Dallas, TX"
                      required
                    />
                  </Field>

                  <Field>
                    <FormLabel htmlFor="destination_preference">Destination Preference</FormLabel>
                    <TextInput
                      id="destination_preference"
                      name="destination_preference"
                      value={form.destination_preference}
                      onChange={onChange}
                      placeholder="e.g. Anywhere east"
                    />
                  </Field>

                  <Field>
                    <FormLabel htmlFor="trailer_type">Trailer Type</FormLabel>
                    <UppercaseInput
                      as="select"
                      id="trailer_type"
                      name="trailer_type"
                      value={form.trailer_type}
                      onChange={onChange}
                      required
                    >
                      <option value="">Select trailer type</option>
                      {Array.from(TRAILER_TYPES_SET).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </UppercaseInput>
                  </Field>

                  <Field>
                    <FormLabel htmlFor="equipment">Equipment</FormLabel>
                    <TextInput
                      id="equipment"
                      name="equipment"
                      value={form.equipment}
                      onChange={onChange}
                      placeholder="e.g. Air ride, liftgate"
                    />
                  </Field>

                  <Field>
                    <FormLabel htmlFor="length_ft">Length (ft)</FormLabel>
                    <TextInput
                      id="length_ft"
                      name="length_ft"
                      type="number"
                      min="1"
                      value={form.length_ft}
                      onChange={onChange}
                      placeholder="e.g. 53"
                    />
                  </Field>

                  <Field>
                    <FormLabel htmlFor="weight_capacity">Weight Capacity (lbs)</FormLabel>
                    <TextInput
                      id="weight_capacity"
                      name="weight_capacity"
                      type="number"
                      min="1"
                      step="100"
                      value={form.weight_capacity}
                      onChange={onChange}
                      placeholder="e.g. 45000"
                    />
                  </Field>

                  <Field $full>
                    <FormLabel htmlFor="comment">Comments</FormLabel>
                    <TextArea
                      id="comment"
                      name="comment"
                      rows={3}
                      value={form.comment}
                      onChange={onChange}
                      placeholder="Any additional details about the truck or load requirements"
                    />
                  </Field>
                </FormGrid>

                {error && <ErrorText>{error}</ErrorText>}

                <ModalFooter>
                  <SecondaryBtn type="button" onClick={onCancel} disabled={adding}>
                    Cancel
                  </SecondaryBtn>
                  <PrimaryBtn type="submit" disabled={adding}>
                    {adding ? 'Posting...' : 'Post Truck'}
                  </PrimaryBtn>
                </ModalFooter>
              </form>
            </ModalCard>
          </ModalOverlay>
        )}
      </Content>
    </Page>
  );
};


// styled-components placed below the component (per preference)
const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #f7f8fb;
  padding: clamp(16px, 2vw, 32px);
  box-sizing: border-box;
`;

const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: auto;
`;

const Logo = styled.img`
  width: clamp(20px, 3vw, 28px);
  height: clamp(20px, 3vw, 28px);
  border-radius: 6px;
`;

const PageName = styled.span`
  font-weight: 700;
  color: #2a2f45;
  font-size: clamp(14px, 2vw, 18px);
`;

const Content = styled.main`
  background: #ffffff;
  border: 1px solid rgba(40, 44, 69, 0.06);
  border-radius: 12px;
  padding: clamp(16px, 2.5vw, 24px);
`;

const PanelTitle = styled.h3`
  margin: 0 0 8px 0;
  color: #2a2f45;
  font-size: clamp(16px, 2.2vw, 18px);
`;

const PanelText = styled.p`
  margin: 0;
  color: #6c757d;
  font-size: clamp(12px, 1.8vw, 14px);
`;

export default TruckBoard;

// Modal styled-components
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 50;
`;

const ModalCard = styled.div`
  width: min(720px, 100%);
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(40, 44, 69, 0.08);
  box-shadow: 0 12px 30px rgba(0,0,0,0.12);
  max-height: 90vh;
  overflow: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(40, 44, 69, 0.06);
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: clamp(16px, 2.2vw, 18px);
  color: #1f2937;
`;

const CloseBtn = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  color: #1f2937;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  &:hover { background: #f3f4f6; }
`;

const FormGrid = styled.div`
  padding: 14px 16px 4px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  align-items: start;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div<{ $full?: boolean }>`
  grid-column: ${(p) => (p.$full ? '1 / -1' : 'auto')};
  /* prevent overflow in CSS grid when content is long */
  min-width: 0;
`;

const FormLabel = styled.label`
  display: block;
  margin: 0 0 6px;
  color: #2a2f45;
  font-size: 13px;
  font-weight: 600;
`;

const sharedInput = `
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(40, 44, 69, 0.16);
  border-radius: 8px;
  background: #fff;
  color: #1f2937;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
  min-height: 40px;
  outline: none;
  &:focus {
    border-color: #111827;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.12);
  }
`;

const TextInput = styled.input`
  ${sharedInput}
`;

const TextArea = styled.textarea`
  ${sharedInput}
  resize: vertical;
`;

/* Visually enforce ALL CAPS for fields like Trailer Type */
const UppercaseInput = styled(TextInput)`
  text-transform: uppercase;
`;

/* Inline row for date input + calendar button */
const DateFieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  min-width: 0;
`;

const CalendarBtn = styled.button`
  appearance: none;
  border: 1px solid rgba(40, 44, 69, 0.16);
  border-radius: 8px;
  background: #fff;
  color: #1f2937;
  padding: 0 10px;
  height: 40px; /* match sharedInput min-height for visual alignment */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover { background: #f3f4f6; }
  svg { width: 20px; height: 20px; }
`;

const ErrorText = styled.div`
  color: #b00020;
  background: #ffe3e3;
  border: 1px solid #ffb3b3;
  margin: 8px 16px 0;
  padding: 8px 10px;
  border-radius: 8px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 16px 16px;
`;

const PrimaryBtn = styled.button`
  appearance: none;
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  color: #ffffff;
  background: #1f2640;
  box-shadow: 0 4px 10px rgba(31, 38, 64, 0.25);
`;

const SecondaryBtn = styled.button`
  appearance: none;
  border: 1px solid rgba(40, 44, 69, 0.16);
  border-radius: 8px;
  padding: 10px 14px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  color: #1f2937;
  background: #fff;
`;

// Toast confirmation action styles (used inside alert action)
const ToastActionRow = styled.div`
  display: inline-flex;
  gap: 8px;
`;

const ToastPrimaryBtn = styled.button`
  appearance: none;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 8px 10px;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  color: #ffffff;
  background: #0d6efd; /* bright blue */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.28);
  transition: background 140ms ease, transform 80ms ease, box-shadow 140ms ease;
  &:hover { background: #0b5ed7; }
  &:active { background: #0a58ca; transform: translateY(0.5px); }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.95), 0 0 0 5px rgba(17, 24, 39, 0.6);
  }
`;

const ToastSecondaryBtn = styled.button`
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 6px;
  padding: 8px 10px;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  color: #ffffff; /* white text */
  background: transparent; /* outlined */
  transition: background 140ms ease, border-color 140ms ease;
  &:hover { background: rgba(255, 255, 255, 0.08); }
  &:active { background: rgba(255, 255, 255, 0.12); }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.85);
  }
`;
