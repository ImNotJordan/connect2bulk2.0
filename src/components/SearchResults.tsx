import React, { useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSearch } from '../contexts/SearchContext';

interface SearchResult {
  id: string;
  title: string;
  type: string;
  path: string;
}

const SearchResults: React.FC = () => {
  const { searchResults, isSearching, searchQuery, setSearchQuery } = useSearch();
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const handleResultClick = (result: SearchResult) => {
    if (result.path) {
      navigate(result.path);
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>, result: SearchResult) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleResultClick(result);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        // Handle click outside if needed
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!searchQuery) {
    return null;
  }

  return (
    <ResultsContainer ref={resultsRef}>
      {isSearching ? (
        <LoadingMessage>Searching...</LoadingMessage>
      ) : searchResults.length > 0 ? (
        <ResultsList>
          {searchResults.map((result: SearchResult) => (
            <ResultItem 
              key={result.id}
              onClick={() => handleResultClick(result)}
              onKeyDown={(e) => handleKeyDown(e, result)}
              role="button"
              tabIndex={0}
            >
              <ResultTitle>{result.title}</ResultTitle>
              <ResultType>{result.type}</ResultType>
            </ResultItem>
          ))}
        </ResultsList>
      ) : searchQuery ? (
        <NoResults>No results found for "{searchQuery}"</NoResults>
      ) : null}
    </ResultsContainer>
  );
};

export default SearchResults;

const ResultsContainer = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #1e293b;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  border: 1px solid rgba(71, 85, 105, 0.2);
  width: 100%;
  min-width: 280px;
`;

const ResultsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ResultItem = styled.li`
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(71, 85, 105, 0.2);
  display: flex;
  flex-direction: column;
  gap: 2px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  &:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  
  &:last-child {
    border-bottom: none;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const ResultTitle = styled.div`
  font-weight: 500;
  color: #f8fafc;
  margin-bottom: 4px;
`;

const ResultType = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: capitalize;
`;

const LoadingMessage = styled.div`
  padding: 16px;
  color: #94a3b8;
  text-align: center;
`;

const NoResults = styled.div`
  padding: 16px;
  color: #94a3b8;
  text-align: center;
`;
