import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import Sidebar from './Sidebar'
import { Icon } from '@iconify-icon/react'
import { useSearch } from '../contexts/SearchContext'
import SearchResults from '../components/SearchResults'
import { search as performSearch } from '../services/searchService'
import { generateClient } from 'aws-amplify/data'
import { getCurrentUser } from 'aws-amplify/auth'
import type { Schema } from '../../amplify/data/resource'
import { useAlert } from '../components/AlertProvider'
import { TRAILER_TYPES } from '../pages/firm/constants'
import { useLoadContext } from '../context/LoadContext'

const toAllCaps = (s: string) => (s || '').toUpperCase()

type FormState = {
  load_number: string
  pickup_date: string
  delivery_date: string
  origin: string
  destination: string
  trailer_type: string
  equipment_requirement: string
  miles: string
  rate: string
  frequency: string
  comment: string
}

const defaultForm: FormState = {
  load_number: '',
  pickup_date: '',
  delivery_date: '',
  origin: '',
  destination: '',
  trailer_type: '',
  equipment_requirement: '',
  miles: '',
  rate: '',
  frequency: 'once',
  comment: '',
}

const AppLayout: React.FC = () => {
  // Initialize Amplify client after configuration
  const client = useMemo(() => generateClient<Schema>(), []);

  const [collapsed, setCollapsed] = useState(false)
  const [quickCreateOpen, setQuickCreateOpen] = useState(false)
  const quickCreateRef = useRef<HTMLDivElement | null>(null)
  const searchWrapperRef = useRef<HTMLFormElement | null>(null)
  const { searchQuery, setSearchQuery, setSearchResults, setIsSearching } = useSearch()
  
  // Add New Load modal state
  const [isAddLoadOpen, setAddLoadOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({ ...defaultForm })
  const pickupDateInputRef = useRef<HTMLInputElement | null>(null)
  const deliveryDateInputRef = useRef<HTMLInputElement | null>(null)
  const { info } = useAlert()
  const { setLastCreated } = useLoadContext()
  const quickCreateOptions = [
    { label: 'Quote', icon: 'lucide:file-text' },
    { label: 'Load', icon: 'lucide:truck' },
    { label: 'RFP', icon: 'lucide:file-input' },
    { label: 'Carrier', icon: 'lucide:users' },
    { label: 'Contact', icon: 'lucide:user-plus' }
  ]

  useEffect(() => {
    if (!quickCreateOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (!quickCreateRef.current) return
      if (!quickCreateRef.current.contains(event.target as Node)) {
        setQuickCreateOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setQuickCreateOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [quickCreateOpen])

  const handleQuickCreateToggle = () => {
    setQuickCreateOpen((open) => !open)
  }

  const handleQuickCreateSelect = (label: string) => {
    setQuickCreateOpen(false)
    if (label === 'Load') {
      // Generate a unique load number when opening the modal
      const prefix = 'LN'
      const timestamp = Date.now().toString().slice(-6)
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
      const loadNumber = `${prefix}-${timestamp}-${random}`
      setForm({ ...defaultForm, load_number: loadNumber })
      setAddLoadOpen(true)
    }
  }

  // Debounced search handler
  useEffect(() => {
    const delayTimer = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true)
        try {
          const results = await performSearch(searchQuery)
          setSearchResults(results)
        } catch (error) {
          // Search error
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(delayTimer)
  }, [searchQuery, setSearchResults, setIsSearching])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  // Load form handlers
  const openDatePicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    const el = ref.current as any
    try {
      if (el?.showPicker) {
        el.showPicker()
        return
      }
    } catch (_) {
      // ignore and fallback to focus
    }
    ref.current?.focus()
  }

  const handleLoadFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement
    if (name === 'pickup_date' || name === 'delivery_date') {
      const parts = value.split('-')
      if (parts[0] && parts[0].length > 4) parts[0] = parts[0].slice(0, 4)
      const sanitized = parts.join('-')
      setForm((prev) => ({ ...prev, [name]: sanitized }))
      return
    }
    if (name === 'trailer_type') {
      setForm((prev) => ({ ...prev, trailer_type: toAllCaps(value) }))
      return
    }
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const closeLoadModal = () => {
    if (adding) return
    setError(null)
    setAddLoadOpen(false)
    setForm({ ...defaultForm })
  }

  const validateLoadForm = (): string | null => {
    const { load_number, pickup_date, delivery_date, origin, destination, trailer_type } = form
    if (!load_number.trim()) return 'Load number is required.'
    if (!pickup_date) return 'Pickup date is required.'
    if (!delivery_date) return 'Delivery date is required.'
    if (!origin.trim()) return 'Origin is required.'
    if (!destination.trim()) return 'Destination is required.'
    if (!trailer_type.trim()) return 'Trailer type is required.'
    return null
  }

  const handleCreateLoad = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validateLoadForm()
    if (validationError) {
      setError(validationError)
      return
    }
    
    setAdding(true)
    setError(null)

    try {
      const user = await getCurrentUser()
      const userId = user.userId

      const loadData = {
        load_number: form.load_number.trim(),
        pickup_date: form.pickup_date,
        delivery_date: form.delivery_date,
        origin: form.origin.trim(),
        destination: form.destination.trim(),
        trailer_type: form.trailer_type.trim(),
        equipment_requirement: form.equipment_requirement.trim() || undefined,
        miles: form.miles ? parseFloat(form.miles) : undefined,
        rate: form.rate ? parseFloat(form.rate) : undefined,
        frequency: form.frequency,
        comment: form.comment.trim() || undefined,
        owner_id: userId,
      }

      const result = await client.models.Load.create(loadData)
      if (result.data) {
        setLastCreated(result.data.id)
        info({ message: 'Load created successfully!' })
        closeLoadModal()
      } else {
        throw new Error('Failed to create load')
      }
    } catch (err: any) {
      // Error creating load
      setError(err.message || 'Failed to create load. Please try again.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <Wrapper $collapsed={collapsed}>
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />
      <Main $collapsed={collapsed}>
        <GlobalTopbar $collapsed={collapsed}>
          <QuickCreateWrapper ref={quickCreateRef}>
            <QuickCreateButton
              type="button"
              onClick={handleQuickCreateToggle}
              aria-haspopup="menu"
              aria-expanded={quickCreateOpen}
            >
              <Icon icon="lucide:plus" className="icon" aria-hidden="true" />
              <span>Quick Create</span>
            </QuickCreateButton>
            {quickCreateOpen && (
              <QuickCreateMenu role="menu">
                {quickCreateOptions.map(({ label, icon }) => (
                  <QuickCreateMenuItem key={label}>
                    <QuickCreateMenuButton type="button" role="menuitem" onClick={() => handleQuickCreateSelect(label)}>
                      <Icon icon={icon} className="icon" aria-hidden="true" />
                      <span>{label}</span>
                    </QuickCreateMenuButton>
                  </QuickCreateMenuItem>
                ))}
              </QuickCreateMenu>
            )}
          </QuickCreateWrapper>
          <SearchWrapper role="search" onSubmit={handleSearchSubmit} ref={searchWrapperRef}>
            <Icon icon="lucide:search" className="icon" aria-hidden="true" />
            <SearchInput
              type="search"
              placeholder="Search..."
              aria-label="Global search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <SearchResults />
          </SearchWrapper>
          <TopbarActions>
            <IconButton type="button" aria-label="Open notifications">
              <Icon icon="mdi:bell-outline" className="icon" aria-hidden="true" />
            </IconButton>
            <IconButton type="button" aria-label="Open AI command bar" $withLabel>
              <Icon icon="mdi:robot-outline" className="icon" aria-hidden="true" />
              <span>AI Command Bar</span>
            </IconButton>
          </TopbarActions>
        </GlobalTopbar>
        <Content>
          <Outlet />
        </Content>
      </Main>

      {/* Add New Load Modal */}
      {isAddLoadOpen && (
        <ModalOverlay role="dialog" aria-modal="true" onClick={closeLoadModal}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Add New Load</ModalTitle>
              <CloseBtn type="button" onClick={closeLoadModal} aria-label="Close">
                <Icon icon="mdi:close" />
              </CloseBtn>
            </ModalHeader>
            <form onSubmit={handleCreateLoad}>
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
                      onChange={handleLoadFormChange}
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
                      onChange={handleLoadFormChange}
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
                    onChange={handleLoadFormChange}
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
                    onChange={handleLoadFormChange}
                    required
                    maxLength={120}
                  />
                </Field>
                <Field>
                  <FormLabel htmlFor="trailer_type">Trailer Type*</FormLabel>
                  <UppercaseInput
                    id="trailer_type"
                    name="trailer_type"
                    value={form.trailer_type}
                    onChange={handleLoadFormChange}
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
                    onChange={handleLoadFormChange}
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
                    onChange={handleLoadFormChange}
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
                    onChange={handleLoadFormChange}
                  />
                </Field>
                <Field>
                  <FormLabel htmlFor="frequency">Frequency</FormLabel>
                  <Select id="frequency" name="frequency" value={form.frequency} onChange={handleLoadFormChange} required>
                    <option value="once">Once Only</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </Select>
                </Field>
                <Field $full>
                  <FormLabel htmlFor="comment">Comment</FormLabel>
                  <TextArea id="comment" name="comment" rows={3} maxLength={500} value={form.comment} onChange={handleLoadFormChange} />
                </Field>
              </FormGrid>
              {error && <ErrorText role="alert">{error}</ErrorText>}
              <ModalFooter>
                <SecondaryBtn type="button" onClick={closeLoadModal} disabled={adding}>
                  Cancel
                </SecondaryBtn>
                <PrimaryBtn type="submit" disabled={adding}>
                  {adding ? 'Saving…' : 'Save Load'}
                </PrimaryBtn>
              </ModalFooter>
            </form>
          </ModalCard>
        </ModalOverlay>
      )}
    </Wrapper>
  )
}

export default AppLayout

// styled-components (kept below the component at module scope per project rules)
const sidebarWidth = '264px'
const collapsedWidth = '73px'
const breakpoint = '768px'
const topbarHeight = '80px'

const Wrapper = styled.div<{ $collapsed: boolean }>`
  display: block;
  min-height: 100dvh;
  width: 100dvw;
  box-sizing: border-box;
  /* Prevent any descendant from causing page-level horizontal scroll */
  overflow-x: hidden;
`

const Main = styled.main<{ $collapsed: boolean }>`
  box-sizing: border-box;
  /* Constrain to viewport width minus sidebar to avoid overflow; use dvw to exclude scrollbar width */
  width: calc(100dvw - ${(p) => (p.$collapsed ? collapsedWidth : sidebarWidth)});
  max-width: calc(100dvw - ${(p) => (p.$collapsed ? collapsedWidth : sidebarWidth)});
  min-width: 0;
  min-height: 100dvh;
  padding: 0;
  padding-top: ${topbarHeight};
  position: relative; /* create a local stacking context below the tab */
  z-index: 0;
  margin: 0;
  margin-left: ${(p) => (p.$collapsed ? collapsedWidth : sidebarWidth)};
  display: flex;
  flex-direction: column;
  
  /* Keep page from introducing horizontal scroll while allowing the fixed tab to overlay */
  overflow-x: hidden;
`

const GlobalTopbar = styled.header<{ $collapsed: boolean }>`
  display: grid;
  grid-template-columns: auto minmax(240px, 1fr) auto;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  padding-left: 48px;
  background: rgba(15, 23, 42, 0.92);
  color: #e2e8f0;
  position: fixed;
  top: 0;
  left: ${(p) => (p.$collapsed ? collapsedWidth : sidebarWidth)};
  width: calc(100dvw - ${(p) => (p.$collapsed ? collapsedWidth : sidebarWidth)});
  min-height: ${topbarHeight};
  box-sizing: border-box;
  z-index: 50;
  backdrop-filter: saturate(120%) blur(8px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);

  @media (max-width: ${breakpoint}) {
    left: 0;
    width: 100dvw;
  }
`

const QuickCreateMenu = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-width: 100%;
  padding: 8px;
  margin: 0;
  list-style: none;
  background: rgba(15, 23, 42, 0.96);
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.45);
  z-index: 60;
`

const QuickCreateMenuItem = styled.li`
  width: 100%;
`

const QuickCreateMenuButton = styled.button`
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #f8fafc;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 160ms ease, transform 120ms ease;

  &:hover {
    background: rgba(220, 20, 60, 0.2);
    transform: translateY(-1px);
  }

  &:active {
    background: rgba(220, 20, 60, 0.28);
    transform: translateY(0);
  }

  .icon {
    font-size: 18px;
  }
`

const QuickCreateWrapper = styled.div`
  position: relative;
  display: inline-flex;
`

const QuickCreateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #dc143c, #a00e2b);
  color: #f8fafc;
  font-weight: 600;
  font-size: 14px;
  transition: transform 120ms ease, box-shadow 160ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 25px rgba(220, 20, 60, 0.35);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 16px rgba(220, 20, 60, 0.28);
  }

  .icon {
    width: 18px;
    height: 18px;
  }
`

const SearchWrapper = styled.form`
  position: relative;
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  gap: 10px;
  background: rgba(15, 23, 42, 0.35);
  border-radius: 12px;
  padding: 10px 16px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  color: #cbd5e1;

  .icon {
    width: 20px;
    height: 20px;
  }
`

const SearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: #f8fafc;
  font-size: 14px;
  width: 100%;

  &::placeholder {
    color: #94a3b8;
  }
`

const TopbarActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`

const IconButton = styled.button<{ $withLabel?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => (p.$withLabel ? '8px' : '0')};
  justify-content: center;
  padding: ${(p) => (p.$withLabel ? '10px 16px' : '10px')};
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background: rgba(15, 23, 42, 0.35);
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 500;
  transition: background 160ms ease, transform 120ms ease, box-shadow 160ms ease;

  &:hover {
    background: rgba(220, 20, 60, 0.25);
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(15, 23, 42, 0.35);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.3);
  }

  .icon {
    width: 18px;
    height: 18px;
  }
`

const Content = styled.div`
  flex: 1;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
`

// Modal styled components for Add New Load
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 10000;
  backdrop-filter: blur(4px);
`

const ModalCard = styled.div`
  width: min(720px, 100%);
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(40, 44, 69, 0.08);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  max-height: 90vh;
  overflow: auto;
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 12px;
  border-bottom: 1px solid rgba(40, 44, 69, 0.08);
`

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
`

const CloseBtn = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: background 140ms ease, color 140ms ease;
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #1f2937;
  }
  svg {
    width: 20px;
    height: 20px;
  }
`

const FormGrid = styled.div`
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  align-items: start;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const Field = styled.div<{ $full?: boolean }>`
  grid-column: ${(p) => (p.$full ? '1 / -1' : 'auto')};
  min-width: 0;
`

const FormLabel = styled.label`
  display: block;
  margin: 0 0 6px;
  color: #2a2f45;
  font-size: 13px;
  font-weight: 600;
`

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
`

const TextInput = styled.input`
  ${sharedInput}
`

const TextArea = styled.textarea`
  ${sharedInput}
  resize: vertical;
`

const UppercaseInput = styled(TextInput)`
  text-transform: uppercase;
`

const Select = styled.select`
  ${sharedInput}
`

const DateFieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  min-width: 0;
`

const CalendarBtn = styled.button`
  appearance: none;
  border: 1px solid rgba(40, 44, 69, 0.16);
  border-radius: 8px;
  background: #fff;
  color: #1f2937;
  padding: 0 10px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background: #f3f4f6;
  }
  svg {
    width: 20px;
    height: 20px;
  }
`

const ErrorText = styled.div`
  color: #b00020;
  background: #ffe3e3;
  border: 1px solid #ffb3b3;
  margin: 8px 16px 0;
  padding: 8px 10px;
  border-radius: 8px;
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 16px 16px;
`

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
  transition: background 140ms ease, transform 80ms ease;
  &:hover {
    background: #2a3350;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

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
  transition: background 140ms ease;
  &:hover {
    background: #f3f4f6;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`