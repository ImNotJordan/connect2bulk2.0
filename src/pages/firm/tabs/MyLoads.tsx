import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';
import { useLoadContext } from '../../../context/LoadContext';
import { useAlert } from '../../../components/AlertProvider';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from '../../../../amplify/data/resource';

type Props = {
  loads: any[];
  onAddNewLoad: () => void;
  onDeleteLoad?: (loadId: string) => Promise<void>;
  deletingId?: string | null;
};

const MyLoads: React.FC<Props> = ({ 
  loads = [], 
  onAddNewLoad, 
  onDeleteLoad,
  deletingId 
}) => {
  // Search state
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Data state and alert
  const { loadData: contextRows, setLoadData: setContextRows, lastCreated } = useLoadContext();
  const { info } = useAlert();
  const [error] = useState<string | null>(null);
  const [localRows, setLocalRows] = useState<any[]>([]);
  const loading = false; // Loading state not needed for local data

  // Handle delete confirmation
  const handleDeleteClick = (loadId?: string) => {
    if (!loadId || !onDeleteLoad) return;
    
    // Show confirmation dialog
    const { close } = info({
      title: 'Delete Load',
      message: `Are you sure you want to delete load ${loadId}?`,
      autoClose: false,
      closable: true,
      action: (
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => {
              close();
              info({
                title: 'Cancelled',
                message: `Load ${loadId} deletion was cancelled`,
                autoClose: true,
                autoCloseDuration: 3000,
              });
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              close();
              try {
                await onDeleteLoad(loadId);
                // Update local state after successful deletion
                setLocalRows(prev => prev.filter(load => load.id !== loadId));
                // Update context if needed
                if (setContextRows) {
                  setContextRows(prev => prev.filter(load => load.id !== loadId));
                }
              } catch (error) {
                console.error('Error deleting load:', error);
                info({
                  title: 'Error',
                  message: 'Failed to delete load. Please try again.',
                  autoClose: true,
                  autoCloseDuration: 5000,
                });
              }
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
      ),
    });
  };

  // Track initial render with useRef
  const isInitialMount = useRef(true);
  const [currentUser, setCurrentUser] = useState<{ username: string; email?: string } | null>(null);
  
  // Get current user on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser({
          username: user.username,
          email: user.signInDetails?.loginId
        });
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  // Initialize with props or context data, filtered by current user
  useEffect(() => {
    // Skip the effect on initial mount if we already have data
    if (isInitialMount.current && (loads?.length > 0 || contextRows?.length > 0)) {
      isInitialMount.current = false;
      return;
    }
    
    let mounted = true;
    
    const initializeData = async () => {
      if (!mounted || !currentUser) return;
      
      // Filter function to get loads for the current user
      const filterUserLoads = (loads: any[]) => {
        if (!currentUser) return [];
        // Check both owner and sent_by fields for backward compatibility
        return loads.filter(load => 
          load.owner === currentUser.username || 
          load.sent_by === currentUser.email ||
          load.created_by === currentUser.email
        );
      };
      
      // Only update if we have loads from props
      if (loads?.length > 0) {
        const userLoads = filterUserLoads(loads);
        setLocalRows(prev => {
          const loadsStr = JSON.stringify(userLoads);
          const prevStr = JSON.stringify(prev);
          return loadsStr !== prevStr ? [...userLoads] : prev;
        });
      } 
      // Fall back to context data if no loads from props
      else if (contextRows?.length > 0) {
        const userLoads = filterUserLoads(contextRows);
        setLocalRows(prev => {
          const contextStr = JSON.stringify(userLoads);
          const prevStr = JSON.stringify(prev);
          return contextStr !== prevStr ? [...userLoads] : prev;
        });
      }
    };

    initializeData();
    
    return () => {
      mounted = false;
    };
  }, [loads, contextRows, currentUser]);
  
  // Sync context with local rows when needed
  useEffect(() => {
    if (!setContextRows) return;
    
    // Only update context if it's different from localRows
    const contextStr = JSON.stringify(contextRows);
    const localStr = JSON.stringify(localRows);
    
    if (contextStr !== localStr) {
      setContextRows([...localRows]);
    }
  }, [localRows, contextRows, setContextRows]);

  // Handle new loads added via context, only if created by current user
  useEffect(() => {
    if (!lastCreated || !currentUser) return;
    
    // Only add to local rows if the load was created by the current user
    if (lastCreated.owner === currentUser.username || 
        lastCreated.sent_by === currentUser.email ||
        lastCreated.created_by === currentUser.email) {
      setLocalRows(prev => {
        if (!prev.some(l => l.id === lastCreated.id)) {
          return [lastCreated, ...prev];
        }
        return prev;
      });
    }
  }, [lastCreated, currentUser]);
  
  // Sync with props.loads when it changes, filtered by current user
  useEffect(() => {
    if (loads && loads.length > 0 && currentUser) {
      const userLoads = loads.filter(load => 
        load.owner === currentUser.username || 
        load.sent_by === currentUser.email ||
        load.created_by === currentUser.email
      );
      setLocalRows(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(userLoads)) {
          return [...userLoads];
        }
        return prev;
      });
    } else if (!currentUser) {
      setLocalRows([]);
    }
  }, [loads, currentUser]);

  // Filter rows based on search text (using the existing filteredRows implementation)

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchText('');
    searchInputRef.current?.focus();
  }, []);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filteredRows calculation
  }, []);

  const onSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setSearchText('');
    }
  }, []);

  // Global shortcut: Ctrl/Cmd+K focuses the search box
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

  const formatCurrency = useCallback((n?: number) =>
    typeof n === 'number' && !isNaN(n) ? `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '', []);

  const computeAge = useCallback((iso?: string, pickup?: string) => {
    const base = iso || pickup;
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
  }, []);

  // Format a timestamp into a human-readable relative time (e.g., '5m', '2h', '3d')
  const formatTimeAgo = (timestamp: string | Date): string => {
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
  };

  // Filter rows based on search text
  const filteredRows = useMemo(() => {
    if (!searchText.trim()) return localRows;
    
    const search = searchText.toLowerCase();
    return localRows.filter(row => {
      return (
        (row.load_number || '').toLowerCase().includes(search) ||
        (row.origin || '').toLowerCase().includes(search) ||
        (row.destination || '').toLowerCase().includes(search) ||
        (row.trailer_type || '').toLowerCase().includes(search) ||
        (row.status || '').toLowerCase().includes(search) ||
        (row.equipment_requirement || '').toLowerCase().includes(search) ||
        (row.comment || '').toLowerCase().includes(search)
      );
    });
  }, [localRows, searchText]);

  // Table columns
  const columns = [
    { key: 'created_at', header: 'Age' },
    { key: 'load_number', header: 'Load #' },
    { key: 'pickup_date', header: 'Pickup' },
    { key: 'delivery_date', header: 'Delivery' },
    { key: 'origin', header: 'Origin' },
    { key: 'destination', header: 'Destination' },
    { key: 'trailer_type', header: 'Trailer Type' },
    { key: 'equipment_requirement', header: 'Equipment' },
    { key: 'miles', header: 'Miles' },
    { key: 'rate', header: 'Rate' },
    { key: 'frequency', header: 'Freq' },
    { key: 'comment', header: 'Comment' },
    ...(onDeleteLoad ? [{ key: 'actions', header: 'Actions' }] : []),
  ];

  return (
    <>
      <Toolbar>
        <SearchForm onSubmit={handleSearchSubmit} role="search" aria-label="Search my loads">
          <SearchInput
            ref={searchInputRef}
            type="text"
            placeholder="Search my loads by any field"
            aria-label="Search my loads by any field"
            value={searchText}
            onChange={handleSearchChange}
            onKeyDown={onSearchKeyDown}
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

        <RightActions>
          <AddBtn type="button" onClick={onAddNewLoad} aria-label="Add new load">
            Add New Load
          </AddBtn>
        </RightActions>
      </Toolbar>

      <TableWrap>
        <StyledTable>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length}>Loading…</td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan={columns.length} style={{ color: '#b00020' }}>{error}</td>
              </tr>
            )}
            {!loading && !error && localRows.length === 0 && (
              <tr>
                <td colSpan={columns.length}>No loads found.</td>
              </tr>
            )}
            {!loading && !error && filteredRows.map((r: any) => (
              <tr key={r.id ?? `${r.load_number}-${r.created_at}`}>
                {columns.map(col => (
                  <TableCell key={col.key}>
                    {col.key === 'actions' && onDeleteLoad ? (
                     <DeleteButton 
                       onClick={() => handleDeleteClick(r.id)}
                       disabled={deletingId === r.id}
                       aria-label="Delete load"
                       title="Delete load"
                     >
                       <Icon 
                         icon={deletingId === r.id ? 'mdi:loading' : 'mdi:delete'} 
                         style={{
                           animation: deletingId === r.id ? 'spin 1s linear infinite' : 'none',
                         }}
                       />
                     </DeleteButton>
                    ) : col.key === 'created_at' ? (
                      r.created_at ? formatTimeAgo(r.created_at) : 'Just now'
                    ) : (
                      r[col.key] || '-'
                    )}
                  </TableCell>
                ))}
              </tr>
            ))}
          </tbody>
        </StyledTable>

        <PaginationRow>
          <RowsPerPage>
            <span>Rows per page:</span>
            <RppSelect defaultValue={15} aria-label="Rows per page">
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </RppSelect>
          </RowsPerPage>
          <PageInfo>
            {localRows.length > 0 ? `1-${localRows.length} of ${localRows.length}` : '0-0 of 0'}
          </PageInfo>
          <Pager>
            <PageNavBtn aria-label="Previous page" disabled>
              <Icon icon="mdi:chevron-left" />
            </PageNavBtn>
            <PageNavBtn aria-label="Next page" disabled>
              <Icon icon="mdi:chevron-right" />
            </PageNavBtn>
          </Pager>
        </PaginationRow>
      </TableWrap>
    </>
  );
};

/* styled-components below the component (per preference) */
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
  padding: 10px 12px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  color: #ffffff;
  background: #1f2640;
  box-shadow: 0 4px 10px rgba(31, 38, 64, 0.25);
  transition: transform 80ms ease, background 160ms ease;

  &:hover { transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`;

const RightActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto; /* push actions to the right */
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

const TableCell = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid rgba(40, 44, 69, 0.08);
  vertical-align: middle;
  color: #2a2f45;
  font-size: 13px;
`;

const DeleteButton = styled.button`
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
  width: 32px;
  height: 32px;

  &:hover {
    background-color: rgba(220, 53, 69, 0.1);
  }

  &:focus {
    outline: 2px solid rgba(220, 53, 69, 0.3);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

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

const PageInfo = styled.div`
  font-size: 13px;
  color: #6c757d;
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

export default MyLoads;