import React, { useEffect, useRef, useState } from "react";
import styled from 'styled-components';
import FolderTabs from '../../components/FolderTabs';
import { Icon } from '@iconify-icon/react';
import { useAlert } from '../../components/AlertProvider';
import AllFirmLoads from './tabs/AllFirmLoads';
import MyLoads from './tabs/MyLoads';
import { TRAILER_TYPES } from './constants';
import { useLoadContext } from '../../context/LoadContext';
import { generateClient } from 'aws-amplify/data';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from "../../../amplify/data/resource";



const client = generateClient<Schema>();

const TRAILER_TYPES_SET = new Set(TRAILER_TYPES.map((t) => toAllCaps(t)));

function toAllCaps(s: string) {
  return (s || "").toUpperCase();
}

type FormState = {
  load_number: string;
  pickup_date: string;
  delivery_date: string;
  origin: string;
  destination: string;
  trailer_type: string;
  equipment_requirement: string;
  miles: string;
  rate: string;
  frequency: string;
  comment: string;
};

const defaultForm: FormState = {
  load_number: "",
  pickup_date: "",
  delivery_date: "",
  origin: "",
  destination: "",
  trailer_type: "",
  equipment_requirement: "",
  miles: "",
  rate: "",
  frequency: "once",
  comment: "",
};

// Backend integration removed - using local state instead

const LoadBoard: React.FC = () => {
  const { info, warning } = useAlert();
  const { setLastCreated, refreshToken } = useLoadContext();

  // Add Load modal state
  const [isAddOpen, setAddOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ ...defaultForm });
  const [loads, setLoads] = useState<Array<any>>([]);

  // Refs for date inputs and handlers to open native calendar
  const pickupDateInputRef = useRef<HTMLInputElement | null>(null);
  const deliveryDateInputRef = useRef<HTMLInputElement | null>(null);

  // Generate a unique random load number
  const generateLoadNumber = () => {
    const prefix = "LN";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    return `${prefix}-${timestamp}-${random}`;
  };

  const openDatePicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    const el = ref.current as any;
    try {
      if (el?.showPicker) {
        el.showPicker();
        return;
      }
    } catch (_) {
      // ignore and fallback to focus
    }
    ref.current?.focus();
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    if (name === "pickup_date" || name === "delivery_date") {
      // Sanitize: enforce 4-digit year max, keep YYYY-MM-DD shape
      const parts = value.split("-");
      if (parts[0] && parts[0].length > 4) parts[0] = parts[0].slice(0, 4);
      const sanitized = parts.join("-");
      setForm((prev) => ({ ...prev, [name]: sanitized }));
      return;
    }
    if (name === "trailer_type") {
      setForm((prev) => ({ ...prev, trailer_type: toAllCaps(value) }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    if (adding) return;
    setError(null);
    setAddOpen(false);
    setForm({ ...defaultForm });
  };

  // Fetch loads from backend
  const fetchLoads = async () => {
    try {
      setLoading(true);
      console.log('Fetching loads from backend...');
      const result = await client.models.Load.list();
      console.log('Fetched loads:', result);
      if (result.data) {
        setLoads(result.data);
      }
    } catch (err) {
      console.error('Error fetching loads:', err);
      setError('Failed to load loads. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Set up interval for auto-refresh
  useEffect(() => {
    // Initial fetch
    fetchLoads();
    
    // Set up interval to fetch every minute (60000ms)
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing loads...');
      fetchLoads();
    }, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [refreshToken]); // Re-run effect if refreshToken changes

  // Delete a load by ID
  const handleDeleteLoad = async (loadId: string): Promise<void> => {
    if (!loadId) return;
    
    try {
      setLoading(true);
      console.log(`Deleting load with ID: ${loadId}`);
      
      // First try to delete from the backend if authenticated
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        try {
          await client.models.Load.delete({ id: loadId });
          console.log(`Successfully deleted load ${loadId} from backend`);
        } catch (err) {
          console.error('Error deleting load from backend:', err);
          // Continue to local state update even if backend delete fails
        }
      }
      
      // Update local state
      setLoads(prevLoads => prevLoads.filter(load => load.id !== loadId));
      
      info({
        title: 'Success',
        message: 'Load deleted successfully',
        autoClose: true,
        autoCloseDuration: 3000,
        position: 'top-right',
      });
    } catch (err) {
      console.error('Error in handleDeleteLoad:', err);
      setError('Failed to delete load. Please try again.');
      throw err; // Re-throw to allow the caller to handle the error
    } finally {
      setLoading(false);
    }
  };

  // Initialize form with a random load number when modal opens and fetch loads on mount
  useEffect(() => {
    if (isAddOpen) {
      setForm((prev) => ({ ...prev, load_number: generateLoadNumber() }));
    } else {
      fetchLoads();
    }
  }, [isAddOpen, refreshToken]); // Add refreshToken to dependency array to refetch when it changes

  const onCancel = () => {
    if (adding) return;
    const { close } = warning({
      title: "Discard this load?",
      message: "Your changes will be lost.",
      autoClose: false,
      position: "top-right",
      action: (
        <ToastActionRow>
          <ToastPrimaryBtn
            type="button"
            onClick={() => {
              close();
              closeModal();
              info({
                title: "Cancelled",
                message: "Add New Load was cancelled.",
                autoClose: true,
                autoCloseDuration: 3500,
                position: "top-right",
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

  const validateForm = (): string | null => {
    const errors: string[] = [];
    const ln = form.load_number.trim();
    if (!ln) errors.push("Load Number is required.");
    if (ln.length > 50) errors.push("Load Number must be 50 characters or less.");

    const pd = (form.pickup_date || "").trim();
    if (!pd) errors.push("Pickup Date is required.");
    else {
      const m = /^([0-9]{4})-(\d{2})-(\d{2})$/.exec(pd);
      if (!m) errors.push("Pickup Date must be in YYYY-MM-DD format.");
      else {
        const year = parseInt(m[1], 10);
        const month = parseInt(m[2], 10);
        const day = parseInt(m[3], 10);
        if (m[1].length !== 4) errors.push("Year must be 4 digits.");
        if (year < 1900 || year > 2100) errors.push("Year must be between 1900 and 2100.");
        if (month < 1 || month > 12) errors.push("Month must be 01-12.");
        if (day < 1 || day > 31) errors.push("Day must be 01-31.");
        const dt = new Date(pd);
        if (isNaN(dt.getTime())) errors.push("Pickup Date is invalid.");
      }
    }

    // Delivery date validation and ordering check
    const dd = (form.delivery_date || "").trim();
    if (!dd) errors.push("Delivery Date is required.");
    else {
      const md = /^([0-9]{4})-(\d{2})-(\d{2})$/.exec(dd);
      if (!md) errors.push("Delivery Date must be in YYYY-MM-DD format.");
      else {
        const year = parseInt(md[1], 10);
        const month = parseInt(md[2], 10);
        const day = parseInt(md[3], 10);
        if (md[1].length !== 4) errors.push("Delivery year must be 4 digits.");
        if (year < 1900 || year > 2100) errors.push("Delivery year must be between 1900 and 2100.");
        if (month < 1 || month > 12) errors.push("Delivery month must be 01-12.");
        if (day < 1 || day > 31) errors.push("Delivery day must be 01-31.");
        const ddDate = new Date(dd);
        const pdDate = new Date(pd);
        if (!isNaN(ddDate.getTime()) && !isNaN(pdDate.getTime())) {
          if (ddDate.getTime() < pdDate.getTime()) {
            errors.push("Delivery Date cannot be earlier than Pickup Date.");
          }
        }
      }
    }

    // Frequency validation
    const allowedFreq = new Set(["once", "daily", "weekly", "monthly"]);
    if (!allowedFreq.has((form.frequency || "").toLowerCase())) {
      errors.push("Frequency must be one of: once, daily, weekly, monthly.");
    }

    if (!form.origin.trim()) errors.push("Origin is required.");
    if (!form.destination.trim()) errors.push("Destination is required.");

    // Enforce Trailer Type to be required and match allowed list
    if (!form.trailer_type.trim()) {
      errors.push("Trailer Type is required.");
    } else {
      const tt = toAllCaps(form.trailer_type.trim());
      if (!TRAILER_TYPES_SET.has(tt)) {
        errors.push(
          "Trailer Type must match one of the allowed values: " +
            Array.from(TRAILER_TYPES_SET).join(", ") +
            "."
        );
      }
    }

    if (form.miles) {
      const mi = parseInt(form.miles, 10);
      if (isNaN(mi) || mi < 0) errors.push("Miles must be a non-negative integer.");
      if (mi > 2000000) errors.push("Miles seems too large (> 2,000,000).");
    }

    if (form.rate) {
      const r = parseFloat(form.rate as any);
      if (isNaN(r) || r < 0) errors.push("Rate must be a non-negative number.");
      if (r > 10000000) errors.push("Rate seems too large.");
    }

    return errors.length ? errors.join(" ") : null;
  };

  function handleAddLoadLocal(loadData: any) {
    const newLoad = {
      ...loadData,
      id: `local-${Date.now()}`,
      status: "AVAILABLE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  
    console.debug("[LoadBoard] Creating local load:", newLoad);
    info({ message: "Load created successfully (local only)" });
    setLastCreated(newLoad);
    setAddOpen(false);
  }

  const checkAuth = async () => {
    try {
      // We only care if the query succeeds, not the data
      await client.models.Load.list();
      return true;
    } catch (err) {
      console.error('Auth check failed:', err);
      return false;
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('1. Form submission started');
    setError(null);
    setAdding(true);
    
    // Ensure we have the latest loads before adding a new one
    await fetchLoads();

    try {
      console.log('2. Validating form');
      const validation = validateForm();
      if (validation) {
        console.log('3. Validation failed:', validation);
        setError(validation);
        setAdding(false);
        return;
      }
      console.log('3. Form validation passed');

      // Get current user's email
      const user = await getCurrentUser();
      const userEmail = user?.signInDetails?.loginId || '';

      const payload: any = {
        load_number: form.load_number.trim(),
        sent_by: userEmail,
        owner: user.username, // Add owner field with the current user's username
        pickup_date: form.pickup_date.trim(),
        delivery_date: form.delivery_date.trim() || null,
        origin: form.origin.trim(),
        destination: form.destination.trim(),
        trailer_type: form.trailer_type.trim(),
        equipment_requirement: form.equipment_requirement.trim(),
        miles: form.miles ? parseInt(form.miles, 10) : null,
        rate: form.rate ? parseFloat(form.rate) : null,
        frequency: form.frequency,
        comment: form.comment.trim(),
        created_at: new Date().toISOString(),
      };
      console.log('4. Payload prepared:', JSON.stringify(payload, null, 2));

      if (!payload.load_number || !payload.pickup_date || !payload.origin || !payload.destination) {
        const errorMsg = 'Missing required fields';
        console.log('5. Required fields check failed:', {
          load_number: !!payload.load_number,
          pickup_date: !!payload.pickup_date,
          origin: !!payload.origin,
          destination: !!payload.destination
        });
        setError(errorMsg);
        setAdding(false);
        return;
      }
      console.log('5. Required fields check passed');

      // First try to use the backend if authenticated
      const isAuthenticated = await checkAuth();
      
      if (isAuthenticated) {
        try {
          console.log('6. User is authenticated, attempting to create load in backend...');
          const result = await client.models.Load.create({
            load_number: payload.load_number,
            pickup_date: payload.pickup_date,
            delivery_date: payload.delivery_date,
            origin: payload.origin,
            destination: payload.destination,
            trailer_type: payload.trailer_type,
            equipment_requirement: payload.equipment_requirement,
            miles: payload.miles,
            rate: payload.rate,
            frequency: payload.frequency,
            comment: payload.comment,
            created_at: payload.created_at,
            sent_by: userEmail, // Using sent_by instead of owner as per schema
          });
          console.log('7. Backend response:', result);

          if (result.data) {
            console.log('8. Load created successfully:', result.data);
            info({ message: "Load created successfully in backend" });
            setLastCreated(result.data);
            setForm({ ...defaultForm });
            setAddOpen(false);
            setAdding(false);
            return;
          } else if (result.errors) {
            throw new Error(result.errors[0]?.message || 'Failed to create load');
          }
        } catch (err: any) {
          console.error('8. Error creating load in backend:', {
            error: err,
            message: err.message,
            stack: err.stack
          });
          // Continue to fallback to local storage
        }
      } else {
        console.log('6. User is not authenticated, falling back to local storage');
      }
      
      // Fallback to local storage if backend fails or user is not authenticated
      console.log('9. Using local storage as fallback');
      handleAddLoadLocal(payload);
      setForm({ ...defaultForm });
      setAddOpen(false);
    } catch (err: any) {
      console.error('Unexpected error in handleCreate:', {
        error: err,
        message: err.message,
        stack: err.stack
      });
      setError(err?.message ?? "Failed to create load");
    } finally {
      console.log('Final state - setting adding to false');
      setAdding(false);
    }
  };

  return (
    <Page>
      <Content>
        <FolderTabs
          ariaLabel="Loadboard Sections"
          idPrefix="loadboard"
          tabs={[
            {
              id: "all",
              label: "All Firm Loads",
              content: (
                <AllFirmLoads
                  loads={loads}
                  key={`all-firm-loads-${refreshToken}`}
                  onAddNewLoad={() => setAddOpen(true)}
                  onDeleteLoad={handleDeleteLoad}
                  deletingId={loading ? 'deleting' : undefined}
                />
              ),
            },
            {
              id: "search",
              label: "Search Loads",
              content: (
                <>
                  <PanelTitle>Search Loads</PanelTitle>
                  <PanelText>Search interface and results will appear here.</PanelText>
                </>
              ),
            },
            {
              id: "my",
              label: "My Loads",
              content: (
                <MyLoads 
                  loads={loads}
                  onAddNewLoad={() => setAddOpen(true)}
                  onDeleteLoad={handleDeleteLoad}
                  deletingId={loading ? 'deleting' : undefined}
                />
              ),
            },
          ]}
          brand={
            <Brand>
              <PageName>Loadboard</PageName>
              <Logo src="/logo128.png" alt="Connect2Bulk" />
            </Brand>
          }
        />

        {isAddOpen && (
          <ModalOverlay role="dialog" aria-modal="true" onClick={closeModal}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>Add New Load</ModalTitle>
                <CloseBtn type="button" onClick={closeModal} aria-label="Close">
                  <Icon icon="mdi:close" />
                </CloseBtn>
              </ModalHeader>
              <form onSubmit={handleCreate}>
                <FormGrid>
                  <Field $full>
                    <FormLabel htmlFor="load_number">Load Number*</FormLabel>
                    <TextInput
                      id="load_number"
                      name="load_number"
                      value={form.load_number}
                      readOnly
                      aria-readonly="true"
                      required
                      maxLength={50}
                    />
                  </Field>
                  <Field>
                    <FormLabel htmlFor="pickup_date">Pickup Date*</FormLabel>
                    <DateFieldRow>
                      <TextInput
                        id="pickup_date"
                        name="pickup_date"
                        type="date"
                        value={form.pickup_date}
                        onChange={onChange}
                        required
                        min="1900-01-01"
                        max="2100-12-31"
                        autoComplete="off"
                        inputMode="numeric"
                        ref={pickupDateInputRef}
                      />
                      <CalendarBtn
                        type="button"
                        onClick={() => openDatePicker(pickupDateInputRef)}
                        aria-label="Open date picker"
                      >
                        <Icon icon="mdi:calendar-month-outline" />
                      </CalendarBtn>
                    </DateFieldRow>
                  </Field>
                  <Field>
                    <FormLabel htmlFor="delivery_date">Delivery Date*</FormLabel>
                    <DateFieldRow>
                      <TextInput
                        id="delivery_date"
                        name="delivery_date"
                        type="date"
                        value={form.delivery_date}
                        onChange={onChange}
                        required
                        min="1900-01-01"
                        max="2100-12-31"
                        autoComplete="off"
                        inputMode="numeric"
                        ref={deliveryDateInputRef}
                      />
                      <CalendarBtn
                        type="button"
                        onClick={() => openDatePicker(deliveryDateInputRef)}
                        aria-label="Open date picker"
                      >
                        <Icon icon="mdi:calendar-month-outline" />
                      </CalendarBtn>
                    </DateFieldRow>
                  </Field>
                  <Field>
                    <FormLabel htmlFor="origin">Origin*</FormLabel>
                    <TextInput
                      id="origin"
                      name="origin"
                      value={form.origin}
                      onChange={onChange}
                      required
                      maxLength={120}
                    />
                  </Field>
                  <Field>
                    <FormLabel htmlFor="destination">Destination*</FormLabel>
                    <TextInput
                      id="destination"
                      name="destination"
                      value={form.destination}
                      onChange={onChange}
                      required
                      maxLength={120}
                    />
                  </Field>
                  <Field>
                    <FormLabel htmlFor="trailer_type">Trailer Type</FormLabel>
                    <UppercaseInput
                      id="trailer_type"
                      name="trailer_type"
                      value={form.trailer_type}
                      onChange={onChange}
                      list="trailer-type-list"
                      placeholder="TYPE TO SEARCH (e.g., VAN, REEFER)"
                      required
                      maxLength={80}
                      autoComplete="off"
                    />
                    <datalist id="trailer-type-list">
                      {TRAILER_TYPES.map((t) => (
                        <option key={t} value={toAllCaps(t)} />
                      ))}
                    </datalist>
                  </Field>
                  <Field>
                    <FormLabel htmlFor="equipment_requirement">Equipment Requirement</FormLabel>
                    <TextInput
                      id="equipment_requirement"
                      name="equipment_requirement"
                      value={form.equipment_requirement}
                      onChange={onChange}
                      maxLength={120}
                    />
                  </Field>
                  <Field>
                    <FormLabel htmlFor="miles">Miles</FormLabel>
                    <TextInput
                      id="miles"
                      name="miles"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={1}
                      value={form.miles}
                      onChange={onChange}
                    />
                  </Field>
                  <Field>
                    <FormLabel htmlFor="rate">Rate</FormLabel>
                    <TextInput
                      id="rate"
                      name="rate"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={0.01}
                      value={form.rate}
                      onChange={onChange}
                    />
                  </Field>
                  <Field>
                    <FormLabel htmlFor="frequency">Frequency</FormLabel>
                    <Select id="frequency" name="frequency" value={form.frequency} onChange={onChange} required>
                      <option value="once">Once Only</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </Select>
                  </Field>
                  <Field $full>
                    <FormLabel htmlFor="comment">Comment</FormLabel>
                    <TextArea id="comment" name="comment" rows={3} maxLength={500} value={form.comment} onChange={onChange} />
                  </Field>
                </FormGrid>
                {error && <ErrorText role="alert">{error}</ErrorText>}
                <ModalFooter>
                  <SecondaryBtn type="button" onClick={onCancel} disabled={adding}>
                    Cancel
                  </SecondaryBtn>
                  <PrimaryBtn type="submit" disabled={adding}>
                    {adding ? "Saving…" : "Save Load"}
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

const Content = styled.main`
  background: #ffffff;
  border: 1px solid rgba(40, 44, 69, 0.06);
  border-radius: 12px;
  padding: clamp(16px, 2.5vw, 24px);
`;

// Tabs duplicated styles removed; handled by FolderTabs

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

// Brand area (page name + logo) rendered in FolderTabs brand slot
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

 

export default LoadBoard;

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

// Styled select matching input styles
const Select = styled.select`
  ${sharedInput}
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
  color: #111827; /* near-black for readability on white */
  background: #ffffff; /* filled white */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.28);
  transition: background 140ms ease, transform 80ms ease, box-shadow 140ms ease;
  &:hover { background: #f3f4f6; }
  &:active { background: #e5e7eb; transform: translateY(0.5px); }
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