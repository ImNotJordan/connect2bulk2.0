import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import { Icon } from '@iconify-icon/react';
import { SearchProvider, useSearch } from '../contexts/SearchContext';
import { search, debounce } from '../services/searchService';
import SearchResults from '../components/SearchResults';

const SearchBar = () => {
  const { setSearchQuery, setIsSearching, setSearchResults } = useSearch();
  const [localQuery, setLocalQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Debounced search function with dynamic updates
  const performSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      
      setIsSearching(true);
      try {
        const results = await search(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 200), // Reduced debounce time for more responsive feel
    [setSearchResults, setIsSearching]
  );

  // Update local state and trigger search on every change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalQuery(query);
    setSearchQuery(query);
    
    // Trigger search immediately for empty query to clear results
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    // Trigger debounced search
    performSearch(query);
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <SearchWrapper ref={searchRef} $isFocused={isFocused || !!localQuery}>
      <Icon icon="lucide:search" className="search-icon" />
      <SearchInput
        type="text"
        placeholder="Search"
        value={localQuery}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        autoComplete="off"
        aria-label="Search"
      />
      {localQuery && (
        <ClearButton 
          onClick={() => {
            setLocalQuery('');
            setSearchQuery('');
            setSearchResults([]);
          }}
          aria-label="Clear search"
        >
          <Icon icon="lucide:x" />
        </ClearButton>
      )}
      {(isFocused || localQuery) && <SearchResults />}
    </SearchWrapper>
  );
};

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <Wrapper $collapsed={collapsed}>
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />
      <Main $collapsed={collapsed}>
        <GlobalTopbar>
          <QuickCreateButton type="button">
            <Icon icon="lucide:plus" className="icon" aria-hidden="true" />
            <span>Quick Create</span>
          </QuickCreateButton>
          <SearchBar />
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
    </Wrapper>
  );
};

const AppWithSearch: React.FC = () => (
  <SearchProvider>
    <AppLayout />
  </SearchProvider>
);

export default AppWithSearch;

// styled-components (kept below the component at module scope per project rules)
const sidebarWidth = '264px'
const collapsedWidth = '73px'

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
  position: relative; /* create a local stacking context below the tab */
  z-index: 0;
  margin: 0;
  margin-left: ${(p) => (p.$collapsed ? collapsedWidth : sidebarWidth)};
  display: flex;
  flex-direction: column;
  
  /* Keep page from introducing horizontal scroll while allowing the fixed tab to overlay */
  overflow-x: hidden;
`

const GlobalTopbar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 16px 32px;
  background: rgba(15, 23, 42, 0.92);
  color: #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 5;
  backdrop-filter: saturate(120%) blur(8px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
  
  @media (max-width: 768px) {
    padding: 12px 16px;
    gap: 12px;
  }
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

interface SearchWrapperProps {
  $isFocused?: boolean;
}

const SearchWrapper = styled.div<SearchWrapperProps>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(15, 23, 42, 0.35);
  border-radius: 12px;
  padding: 10px 16px;
  border: 1px solid ${props => props.$isFocused ? 'rgba(220, 20, 60, 0.5)' : 'rgba(148, 163, 184, 0.24)'};
  box-shadow: ${props => props.$isFocused ? '0 0 0 2px rgba(220, 20, 60, 0.2)' : 'none'};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  color: #cbd5e1;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;

  .icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: #94a3b8;
  }
`;

const ClearButton = styled.button`
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background: rgba(220, 20, 60, 0.1);
    color: #e2e8f0;
  }

  .icon {
    width: 16px;
    height: 16px;
  }
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: #f8fafc;
  font-size: 14px;
  width: 100%;
  padding: 0;
  margin: 0;
  line-height: 1.5;

  &::placeholder {
    color: #94a3b8;
    opacity: 0.8;
  }
  
  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
    height: 16px;
    width: 16px;
    margin-left: 8px;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>") no-repeat center;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 1;
    }
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
  padding: 24px;
  box-sizing: border-box;
`