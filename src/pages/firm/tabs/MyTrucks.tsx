import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';
import { useAlert } from '../../../components/AlertProvider';
import { getCurrentUser } from 'aws-amplify/auth';
import type { AuthUser } from 'aws-amplify/auth';

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
  owner?: string;
  __typename?: string;
};

type Props = {
  onAddNewTruck: () => void;
  lastCreated?: TruckType | null;
  trucks: TruckType[];
  loading: boolean;
  error: string | null;
  onDeleteTruck?: (truckId: string) => Promise<void>;
};

const MyTrucks: React.FC<Props> = ({
  onAddNewTruck,
  lastCreated,
  trucks: propTrucks,
  loading: propLoading,
  error: propError,
  onDeleteTruck,
}) => {
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [localTrucks, setLocalTrucks] = useState<TruckType[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { info } = useAlert();

  // Get current user on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Initialize local state from props and filter for current user's trucks
  useEffect(() => {
    if (currentUser && propTrucks && propTrucks.length > 0) {
      const userTrucks = propTrucks.filter(truck => truck.owner === currentUser.userId);
      setLocalTrucks(userTrucks);
    } else if (!currentUser) {
      setLocalTrucks([]);
    }
  }, [propTrucks, currentUser]);

  useEffect(() => {
    setIsLoading(propLoading);
    setError(propError);
  }, [propLoading, propError]);

  // Handle last created truck
  useEffect(() => {
    if (lastCreated && currentUser && lastCreated.owner === currentUser.userId) {
      setLocalTrucks(prev => {
        const exists = prev.some(t => t.id === lastCreated.id);
        return exists ? prev : [lastCreated, ...prev];
      });
    }
  }, [lastCreated, currentUser]);

  // Format a timestamp into a human-readable relative time
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
  const totalPages = Math.max(1, Math.ceil(filteredTrucks.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedTrucks = useMemo(() => {
    return filteredTrucks.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredTrucks, startIndex, rowsPerPage]);

  const handleRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
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

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
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

  // Handle delete confirmation
  const handleDeleteClick = (id?: string) => {
    if (!id || !onDeleteTruck) return;
    
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
              info({
                title: 'Cancelled',
                message: `Truck ${id} deletion was cancelled`,
                autoClose: true,
                autoCloseDuration: 3000,
                position: 'top-right',
              });
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              background: 'white',
              color: '#1f2937',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              close();
              try {
                await onDeleteTruck(id);
                info({
                  title: 'Success',
                  message: 'Truck deleted successfully',
                  autoClose: true,
                  autoCloseDuration: 3000,
                  position: 'top-right',
                });
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
    <div>
      <Toolbar>
        <SearchForm onSubmit={(e) => e.preventDefault()}>
          <SearchInput
            ref={searchInputRef}
            type="text"
            placeholder="Search trucks..."
            value={searchText}
            onChange={handleSearchChange}
            aria-label="Search trucks"
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

        <RightActions>
          <AddBtn onClick={onAddNewTruck}>
            <Icon icon="mdi:plus" />
            Add Truck
          </AddBtn>
        </RightActions>
      </Toolbar>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading trucks...</div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>
      ) : (
        <>
          <TableWrap>
            <StyledTable>
              <thead>
                <tr>
                  <th>Truck #</th>
                  <th>Available</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Trailer Type</th>
                  <th>Equipment</th>
                  <th>Length (ft)</th>
                  <th>Weight (lbs)</th>
                  <th>Notes</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTrucks.length > 0 ? (
                  paginatedTrucks.map((truck) => (
                    <tr key={truck.id}>
                      <td>{truck.truck_number || '-'}</td>
                      <td>{truck.available_date || '-'}</td>
                      <td>{truck.origin || '-'}</td>
                      <td>{truck.destination_preference || '-'}</td>
                      <td>{truck.trailer_type || '-'}</td>
                      <td>{truck.equipment || '-'}</td>
                      <td>{truck.length_ft || '-'}</td>
                      <td>{truck.weight_capacity || '-'}</td>
                      <td>{truck.comment || '-'}</td>
                      <td>{truck.created_at ? formatTimeAgo(truck.created_at) : '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              // Implement edit functionality
                              console.log('Edit truck:', truck.id);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#3b82f6',
                              cursor: 'pointer',
                            }}
                            aria-label={`Edit truck ${truck.truck_number}`}
                          >
                            <Icon icon="mdi:pencil" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(truck.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#dc2626',
                              cursor: 'pointer',
                            }}
                            aria-label={`Delete truck ${truck.truck_number}`}
                            disabled={!onDeleteTruck}
                          >
                            <Icon icon="mdi:trash-can-outline" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} style={{ textAlign: 'center', padding: '20px' }}>
                      {searchText ? 'No matching trucks found' : 'No trucks found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </StyledTable>
          </TableWrap>

          {filteredTrucks.length > 0 && (
            <PaginationRow>
              <RowsPerPage>
                Rows per page:{' '}
                <RppSelect value={rowsPerPage} onChange={handleRowsPerPageChange}>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </RppSelect>
              </RowsPerPage>
              <PageInfo>
                {startIndex + 1}-{Math.min(startIndex + rowsPerPage, filteredTrucks.length)} of{' '}
                {filteredTrucks.length}
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
        </>
      )}
    </div>
  );
};

// Styled components
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
  color: #6b7280;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    color: #111827;
    background: #f3f4f6;
  }
  svg {
    width: 16px;
    height: 16px;
  }
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
  cursor: pointer;
  svg {
    width: 18px;
    height: 18px;
  }
`;

const RightActions = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
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

const TableWrap = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: #ffffff;
  border: 1px solid rgba(40, 44, 69, 0.08);
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
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
  tbody tr:hover {
    background-color: #f9fafb;
  }
`;

const PaginationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid rgba(40, 44, 69, 0.08);
  background: #fff;
  border-radius: 0 0 10px 10px;
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

export default MyTrucks;