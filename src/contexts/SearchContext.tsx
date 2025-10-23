import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: any[]; // Replace 'any' with your search result type
  setSearchResults: (results: any[]) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Memoize callbacks to prevent unnecessary re-renders
  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSetSearchResults = useCallback((results: any[]) => {
    setSearchResults(results);
  }, []);

  const handleSetIsSearching = useCallback((searching: boolean) => {
    setIsSearching(searching);
  }, []);

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      searchQuery,
      setSearchQuery: handleSetSearchQuery,
      searchResults,
      setSearchResults: handleSetSearchResults,
      isSearching,
      setIsSearching: handleSetIsSearching,
    }),
    [searchQuery, searchResults, isSearching, handleSetSearchQuery, handleSetSearchResults, handleSetIsSearching]
  );

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
