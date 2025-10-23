import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../../amplify/data/resource';
import { useAlert } from '../../../components/AlertProvider';

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
  owner?: string; // Added owner field to match the schema
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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [localTrucks, setLocalTrucks] = useState<TruckType[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { info } = useAlert();

  // Initialize Amplify client after configuration
  const client = useMemo(() => generateClient<Schema>(), []);

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

  // Format a timestamp into a human-readable relative time (e.g., '5m', '2h', '3d')
  const formatTimeAgo = useCallback((timestamp: string | Date): string => {
    if (!timestamp) return 'Just now';
    
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > 0) return `${diffDays}d`;
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours > 0) return `${diffHours}h`;
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return diffMins > 0 ? `${diffMins}m` : 'Just now';
  }, []);

  // Filter trucks based on search text
  const filteredTrucks = useMemo(() => {
    if (!searchText.trim()) return localTrucks;
    
    const search = searchText.toLowerCase();
    return localTrucks.filter(truck => {
      return (
        (truck.truck_number || '').toLowerCase().includes(search) ||
        (truck.origin || '').toLowerCase().includes(search) ||
        (truck.destination_preference || '').toLowerCase().includes(search) ||
        (truck.trailer_type || '').toLowerCase().includes(search) ||
        (truck.equipment || '').toLowerCase().includes(search) ||
        (truck.comment || '').toLowerCase().includes(search)
      );
    });
  }, [localTrucks, searchText]);

  // Pagination
  const totalPages = Math.ceil(filteredTrucks.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedTrucks = useMemo(() => {
    return filteredTrucks.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredTrucks, startIndex, rowsPerPage]);

  // handlePageChange is not used but kept for future reference
  // const handlePageChange = useCallback((newPage: number) => {
  //   setCurrentPage(newPage);
  // }, []);

  const handleRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing rows per page
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  const clearSearch = useCallback(() => {
    setSearchText('');
    searchInputRef.current?.focus();
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const handlePrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

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
      // AllFirmTrucks list() error
      setError(e?.message ?? 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, [refreshToken]);


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
                if (onDeleteTruck) {
                  await onDeleteTruck(id);
                  // Update local state to reflect the deletion
                  setLocalTrucks((prev) => prev.filter((t) => t.id !== id));
                }
              } catch (err) {
                // Failed to delete truck
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
        <SearchForm onSubmit={(e) => e.preventDefault()} role="search" aria-label="Search trucks">
          <SearchInput
            ref={searchInputRef}
            type="text"
            placeholder="Search trucks by any field"
            aria-label="Search trucks by any field"
            value={searchText}
            onChange={handleSearchChange}
            inputMode="search"
          />
          {searchText && (
            <ClearBtn type="button" onClick={clearSearch} aria-label="Clear search">
              <Icon icon="mdi:close" />
            </ClearBtn>
          )}
          <SearchBtn type="submit" aria-label="Search">
            <Icon icon="mdi:magnify" />
          </SearchBtn>
        </SearchForm>

        <UserFilter aria-label="Filter by users">
          <option value="">Filter by users</option>
          <option value="all">All users</option>
        </UserFilter>

        <RightActions>
          <AddBtn type="button" onClick={onAddNewTruck} aria-label="Add new truck">
            Add New Truck
          </AddBtn>
        </RightActions>
      </Toolbar>

      <TableWrap>
        <StyledTable>
          <thead>
            <tr>
              <th>Age</th>
              <th>Truck #</th>
              <th>Available</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Trailer Type</th>
              <th>Equipment</th>
              <th>Length (ft)</th>
              <th>Weight (lbs)</th>
              <th>Comment</th>
              {(userRole === 'SUPER_MANAGER' || userRole === 'MANAGER' || userRole === 'ADMIN') && (
                <th>Actions</th>
              )}
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
            ) : !isLoading && !error && filteredTrucks.length === 0 ? (
              <tr>
                <td colSpan={userRole === 'SUPER_MANAGER' ? 11 : 10}>
                  {searchText ? 'No matching trucks found.' : 'No trucks available.'}
                </td>
              </tr>
            ) : (
              paginatedTrucks.map((truck: TruckType) => (
                <tr key={truck.id ?? `${truck.truck_number}-${truck.created_at}`}>
                  <td>{truck.created_at ? formatTimeAgo(truck.created_at) : 'Just now'}</td>
                  <td>{truck.truck_number || '-'}</td>
                  <td>{truck.available_date ? new Date(truck.available_date).toLocaleDateString() : '-'}</td>
                  <td>{truck.origin || '-'}</td>
                  <td>{truck.destination_preference || '-'}</td>
                  <td>{truck.trailer_type || '-'}</td>
                  <td>{truck.equipment || '-'}</td>
                  <td>{truck.length_ft || '-'}</td>
                  <td>{truck.weight_capacity ? `${truck.weight_capacity} lbs` : '-'}</td>
                  <td>{truck.comment || '-'}</td>
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

        {filteredTrucks.length > 0 && (
          <PaginationRow>
            <RowsPerPage>
              <span>Rows per page:</span>
              <RppSelect 
                value={rowsPerPage} 
                onChange={handleRowsPerPageChange} 
                aria-label="Rows per page"
              >
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </RppSelect>
            </RowsPerPage>
            <PageInfo>
              {filteredTrucks.length > 0 
                ? `${startIndex + 1}-${Math.min(startIndex + rowsPerPage, filteredTrucks.length)} of ${filteredTrucks.length}` 
                : '0-0 of 0'}
            </PageInfo>
            <Pager>
              <PageNavBtn 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <Icon icon="mdi:chevron-left" />
              </PageNavBtn>
              <PageNavBtn 
                onClick={handleNextPage} 
                disabled={currentPage >= totalPages}
                aria-label="Next page"
              >
                <Icon icon="mdi:chevron-right" />
              </PageNavBtn>
            </Pager>
          </PaginationRow>
        )}
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

const UserFilter = styled.select`
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #fff;
  font-size: 14px;
  color: #1f2937;
  cursor: pointer;
  transition: all 0.2s;
  height: 40px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const TableWrap = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: #ffffff;
  border: 1px solid rgba(40, 44, 69, 0.08);
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
`;

const DeleteBtn = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  color: #dc2626;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #fef2f2;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaginationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid rgba(40, 44, 69, 0.08);
  background: #fff;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const RowsPerPage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #4b5563;
`;

const RppSelect = styled.select`
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
  color: #1f2937;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const PageInfo = styled.span`
  font-size: 14px;
  color: #4b5563;
`;

const Pager = styled.div`
  display: flex;
  gap: 8px;
`;

const PageNavBtn = styled.button`
  appearance: none;
  border: 1px solid rgba(40, 44, 69, 0.16);
  background: #fff;
  color: #1f2937;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #d1d5db;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  
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

/* Styled components are defined above */

export default AllFirmTrucks;
