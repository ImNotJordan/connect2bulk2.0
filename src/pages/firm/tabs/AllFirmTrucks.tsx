import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../../amplify/data/resource';
import { useAlert } from '../../../components/AlertProvider';

// Initialize Amplify client
const client = generateClient<Schema>();

type TruckType = {
  id?: string;
  truck_number?: string;
  available_date?: string;
  origin?: string;
  destination_preference?: string;
  trailer_type?: string;
  equipment?: string;
  length_ft?: number | string;
  weight_capacity?: number | string;
  comment?: string;
  created_at?: string;
  __typename?: string;
};

type Props = {
  onAddNewTruck: () => void;
  refreshToken: number;
  lastCreated?: TruckType | null;
  trucks: TruckType[];
  loading: boolean;
  error: string | null;
  userRole?: string | null;
  onDeleteTruck?: (truckId: string) => Promise<void>;
};

const AllFirmTrucks: React.FC<Props> = ({
  onAddNewTruck,
  refreshToken,
  lastCreated,
  trucks: propTrucks,
  loading: propLoading,
  error: propError,
  userRole,
  onDeleteTruck,
}) => {
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [localTrucks, setLocalTrucks] = useState<TruckType[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { info } = useAlert();

  // Initialize local state from props
  useEffect(() => {
    if (propTrucks && propTrucks.length > 0) {
      setLocalTrucks(propTrucks);
      setIsInitialized(true);
    } else if (!isInitialized) {
      setLocalTrucks([]);
      setIsInitialized(true);
    }
  }, [propTrucks, isInitialized]);

  useEffect(() => {
    setIsLoading(propLoading);
    setError(propError);
  }, [propLoading, propError]);

  // Handle last created truck
  useEffect(() => {
    if (lastCreated) {
      setLocalTrucks((prev) => {
        const exists = prev.some((t) => t.id === lastCreated.id);
        return exists ? prev : [lastCreated, ...prev];
      });
    }
  }, [lastCreated]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const clearSearch = () => {
    setSearchText('');
    searchInputRef.current?.focus();
  };

  const handleSearchSubmit = (e: React.FormEvent) => e.preventDefault();

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') clearSearch();
  };

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      const isMetaK = (ev.ctrlKey || ev.metaKey) && (ev.key === 'k' || ev.key === 'K');
      if (isMetaK) {
        ev.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const fetchRows = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await client.models.Truck.list();
      const raw = (res as any)?.data;
      const listCandidate = Array.isArray(raw)
        ? raw
        : Array.isArray((raw as any)?.items)
        ? (raw as any).items
        : Array.isArray((res as any)?.items)
        ? (res as any).items
        : [];
      const list = Array.isArray(listCandidate) ? listCandidate : [];
      const parseDate = (x: any) => {
        const v = x?.created_at ?? x?.available_date;
        const d = v ? new Date(v) : null;
        return d && !isNaN(d.getTime()) ? d.getTime() : 0;
      };
      const sorted = [...list].sort((a, b) => parseDate(b) - parseDate(a));
      const key = (x: any) => x?.id ?? `${x?.truck_number ?? ''}-${x?.created_at ?? ''}`;
      const merged = lastCreated
        ? sorted.some((r: any) => key(r) === key(lastCreated))
          ? sorted
          : [lastCreated, ...sorted]
        : sorted;
      setLocalTrucks(merged);
    } catch (e: any) {
      console.error('[AllFirmTrucks] list() error:', e);
      setError(e?.message ?? 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, [refreshToken]);

  const filteredTrucks = useMemo(() => {
    if (!searchText.trim()) return localTrucks;
    const searchLower = searchText.toLowerCase();
    return localTrucks.filter(
      (truck: TruckType) =>
        truck.truck_number?.toLowerCase().includes(searchLower) ||
        truck.origin?.toLowerCase().includes(searchLower) ||
        truck.destination_preference?.toLowerCase().includes(searchLower) ||
        truck.trailer_type?.toLowerCase().includes(searchLower)
    );
  }, [localTrucks, searchText]);

  const handleRefresh = () => onAddNewTruck();

  const computeAge = (iso?: string, available?: string): string => {
    const base = iso || available;
    if (!base) return '';
    const d = new Date(base);
    if (isNaN(d.getTime())) return '';
    const diffMs = Date.now() - d.getTime();
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    if (diffDays > 0) return `${diffDays}d`;
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    if (diffHours > 0) return `${diffHours}h`;
    const diffMins = Math.floor(diffMs / (60 * 1000));
    return `${Math.max(diffMins, 0)}m`;
  };

  const handleDeleteClick = (id?: string) => {
    if (!id) return;
    
    // Show confirmation dialog using AlertProvider
    const { close } = info({
      title: 'Delete Truck',
      message: `Are you sure you want to delete truck ${id}?`,
      autoClose: false,
      closable: true,
      action: (
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => {
              close();
              // Show a cancelled message
              info({
                title: 'Cancelled',
                message: `Truck ${id} deletion was cancelled`,
                autoClose: true,
                autoCloseDuration: 3000,
              });
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              background: 'white',
              color: '#1f2937',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: '500',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              close();
              try {
                await client.models.Truck.delete({ id });
                setLocalTrucks((prev) => prev.filter((t) => t.id !== id));

                // Update sessionStorage
                const cached = sessionStorage.getItem('trucks');
                if (cached) {
                  const parsed = JSON.parse(cached) as TruckType[];
                  sessionStorage.setItem(
                    'trucks',
                    JSON.stringify(parsed.filter((t) => t.id !== id))
                  );
                }

                onDeleteTruck?.(id);
              } catch (err) {
                console.error('Failed to delete truck:', err);
                info({
                  title: 'Error',
                  message: 'Failed to delete truck. Please try again.',
                  autoClose: true,
                  autoCloseDuration: 5000,
                });
              }
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid #dc2626',
              background: '#dc2626',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
      ),
    });
  };

  return (
    <>
      <Toolbar>
        <SearchForm onSubmit={handleSearchSubmit} role="search">
          <SearchInput
            ref={searchInputRef}
            type="text"
            placeholder="Search trucks by any field"
            value={searchText}
            onChange={handleSearchChange}
            onKeyDown={onSearchKeyDown}
          />
          {searchText && (
            <ClearBtn type="button" onClick={clearSearch}>
              <Icon icon="mdi:close" />
            </ClearBtn>
          )}
          <SearchBtn type="submit">
            <Icon icon="mdi:magnify" />
          </SearchBtn>
        </SearchForm>

        <RightActions>
          <AddBtn type="button" onClick={onAddNewTruck}>
            Post Truck
          </AddBtn>
        </RightActions>
      </Toolbar>

      <TableWrap>
        <StyledTable>
          <thead>
            <tr>
              <th>Age</th>
              <th>Truck Number</th>
              <th>Available Date</th>
              <th>Origin</th>
              <th>Destination Pref</th>
              <th>Trailer Type</th>
              <th>Equipment</th>
              <th>Length (ft)</th>
              <th>Weight Capacity</th>
              <th>Comment</th>
              {(userRole === 'SUPER_MANAGER' || userRole === 'MANAGER' || userRole === 'ADMIN') && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={userRole === 'SUPER_MANAGER' ? 11 : 10}>Loading…</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={userRole === 'SUPER_MANAGER' ? 11 : 10} style={{ color: '#b00020' }}>{error}</td>
              </tr>
            ) : filteredTrucks.length === 0 ? (
              <tr>
                <td colSpan={userRole === 'SUPER_MANAGER' ? 11 : 10}>No trucks found.</td>
              </tr>
            ) : (
              filteredTrucks.map((truck: TruckType) => (
                <tr key={truck.id ?? `${truck.truck_number}-${truck.created_at}`}>
                  <td>{computeAge(truck.created_at, truck.available_date)}</td>
                  <td>{truck.truck_number}</td>
                  <td>{truck.available_date}</td>
                  <td>{truck.origin}</td>
                  <td>{truck.destination_preference}</td>
                  <td>{truck.trailer_type}</td>
                  <td>{truck.equipment}</td>
                  <td>{typeof truck.length_ft === 'number' ? truck.length_ft : ''}</td>
                  <td>{typeof truck.weight_capacity === 'number' ? truck.weight_capacity : ''}</td>
                  <td>{truck.comment}
                  </td>
                  {(userRole === 'SUPER_MANAGER' || userRole === 'MANAGER' || userRole === 'ADMIN') && (
                    <td>
                      <DeleteBtn type="button" onClick={() => handleDeleteClick(truck.id)}>
                        <Icon icon="mdi:delete" />
                      </DeleteBtn>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </StyledTable>

        {/* Pagination can remain the same as your original */}
      </TableWrap>
    </>
  );
};

// styled-components below the component (per preference)
const Toolbar = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  background: #ffffff;
  border: 1px solid rgba(40, 44, 69, 0.08);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 12px;
`;

const SearchForm = styled.form`
  display: inline-flex;
  align-items: stretch;
  border: 1px solid rgba(40, 44, 69, 0.16);
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  max-width: 100%;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  padding: 10px 12px;
  width: min(380px, 70vw);
  font-size: 14px;
  font-family: inherit;
  background-color: #fff;
  color: #1f2937;

  &::placeholder { color: #9aa3b2; }
`;

const ClearBtn = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  color: #6b7280; /* gray-500 */
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &:hover { color: #111827; background: #f3f4f6; }
  svg { width: 16px; height: 16px; }
`;

const SearchBtn = styled.button`
  appearance: none;
  border: none;
  background: #111827;
  color: #fff;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg { width: 18px; height: 18px; }
`;

const AddBtn = styled.button`
  appearance: none;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  color: #ffffff;
  background: #1f2640;
  box-shadow: 0 4px 10px rgba(31, 38, 64, 0.25);
  transition: transform 80ms ease, background 160ms ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  
  &:hover {
    background: #2d3748;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(31, 38, 64, 0.2);
  }
`;

const RightActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto; /* push actions to the right */
  overflow-y: hidden;
  background: #fff;
`;

const RefreshBtn = styled.button`
  appearance: none;
  border: 1px solid rgba(40, 44, 69, 0.16);
  border-radius: 8px;
  padding: 9px 12px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  background: #fff;
  color: #1f2937;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 160ms ease, transform 80ms ease;
  &:hover { background: #f3f4f6; }
  &:active { transform: translateY(0.5px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  svg { width: 18px; height: 18px; }
`;

/* Table */
const TableWrap = styled.div`
  border: 1px solid rgba(40, 44, 69, 0.06);
  border-radius: 10px;
  overflow-x: auto; /* allow horizontal scroll on smaller screens */
  overflow-y: hidden;
  background: #fff;
`;

const DeleteBtn = styled.button`
 background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(220, 53, 69, 0.1);
  }

  &:focus {
    outline: 2px solid rgba(220, 53, 69, 0.3);
    outline-offset: 2px;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  thead th {
    text-align: left;
    background: #f3f5f9;
    color: #2a2f45;
    font-weight: 700;
    font-size: 13px;
    padding: 12px;
    border-bottom: 1px solid rgba(40, 44, 69, 0.08);
  }

  tbody td {
    padding: 12px;
    font-size: 13px;
    color: #394260;
    border-top: 1px solid rgba(40, 44, 69, 0.04);
    white-space: nowrap;
  }
`;

/* Pagination */
const PaginationRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-top: 1px solid rgba(40, 44, 69, 0.06);
`;

const RowsPerPage = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #6c757d;
  font-size: 13px;
`;

const RppSelect = styled.select`
  border: 1px solid rgba(40, 44, 69, 0.16);
  border-radius: 6px;
  padding: 6px 8px;
  background: #fff;
  color: #1f2937;
`;

const Pager = styled.div`
  display: inline-flex;
  gap: 6px;
`;

const PageNavBtn = styled.button`
  appearance: none;
  border: 1px solid rgba(40, 44, 69, 0.16);
  background: #fff;
  color: #1f2937;
  width: 32px;
  height: 28px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg { width: 18px; height: 18px; }
`;

export default AllFirmTrucks;
