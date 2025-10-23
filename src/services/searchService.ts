import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

// Lazy initialization - client will be created when first needed
let client: ReturnType<typeof generateClient<Schema>> | null = null;

const getClient = () => {
  if (!client) {
    client = generateClient<Schema>();
  }
  return client;
};

type SearchResultType = 
  | 'load' 
  | 'carrier' 
  | 'lane' 
  | 'contact' 
  | 'document';

interface SearchResult {
  id: string;
  title: string;
  type: SearchResultType;
  path: string;
  subtitle?: string;
  icon?: string;
  relevance?: number; // For sorting results by relevance
}

// Global search is restricted to: Loads, Carriers, Lanes, Contacts, and Documents only

// Helper function to calculate relevance score
const calculateRelevance = (text: string, query: string, keywords: string[] = []): number => {
  const queryTerms = query.toLowerCase().split(/\s+/);
  const textLower = text.toLowerCase();
  
  // Exact match has highest priority
  if (textLower === query.toLowerCase()) return 100;
  
  // Check for keyword matches
  const keywordMatch = keywords.some(kw => 
    queryTerms.some(term => kw.toLowerCase().includes(term) || term.includes(kw.toLowerCase()))
  );
  
  // Check for partial matches
  const partialMatch = queryTerms.some(term => textLower.includes(term));
  
  // Check for word boundary matches
  const wordBoundaryMatch = new RegExp(`\\b${queryTerms.join('\\b|\\b')}`, 'i').test(text);
  
  // Calculate score
  let score = 0;
  if (keywordMatch) score += 50;
  if (wordBoundaryMatch) score += 30;
  if (partialMatch) score += 10;
  
  return score;
};

// Helper to add search results with relevance scoring
const addSearchResult = (
  results: SearchResult[],
  item: any,
  type: SearchResultType,
  title: string,
  path: string,
  icon: string,
  searchTerm: string,
  subtitle?: string,
  keywords: string[] = []
) => {
  const titleScore = calculateRelevance(title, searchTerm, keywords);
  const subtitleScore = subtitle ? calculateRelevance(subtitle, searchTerm) : 0;
  const keywordScore = keywords.some(kw => kw.toLowerCase().includes(searchTerm)) ? 20 : 0;
  const totalScore = Math.max(titleScore, subtitleScore) + keywordScore;
  
  if (totalScore > 0) {
    results.push({
      id: item.id,
      title,
      type,
      path,
      subtitle,
      icon,
      relevance: totalScore
    });
  }
};

export const search = async (query: string): Promise<SearchResult[]> => {
  if (!query.trim()) return [];
  
  try {
    const searchTerm = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // 1. Search Loads
    try {
      const { data: loads } = await getClient().models.Load?.list({
        filter: {
          or: [
            { load_number: { contains: searchTerm } },
            { origin: { contains: searchTerm } },
            { destination: { contains: searchTerm } },
            { trailer_type: { contains: searchTerm } },
            { equipment_requirement: { contains: searchTerm } },
          ]
        },
        limit: 5
      }) || { data: [] };

      loads?.forEach(load => {
        if (load.id) {
          const loadNumber = load.load_number || 'Unnumbered';
          const subtitle = `${load.origin || 'Unknown'} → ${load.destination || 'Unknown'}`;
          
          addSearchResult(
            results,
            load,
            'load',
            `Load #${loadNumber}`,
            `/loads/${load.id}`,
            'mdi:truck-delivery',
            searchTerm,
            subtitle,
            ['shipment', 'freight', 'delivery']
          );
        }
      });
    } catch (error) {
      // Error searching loads
    }

    // 2. Search Carriers (Firms)
    try {
      const { data: carriers } = await getClient().models.Firm?.list({
        filter: {
          or: [
            { firm_name: { contains: searchTerm } },
            { address: { contains: searchTerm } },
            { city: { contains: searchTerm } },
            { state: { contains: searchTerm } },
            { firm_type: { contains: searchTerm } },
            { mc: { contains: searchTerm } },
            { dot: { contains: searchTerm } }
          ]
        },
        limit: 10
      }) || { data: [] };

      carriers?.forEach(carrier => {
        if (carrier.id && carrier.firm_name) {
          const subtitle = `${carrier.firm_type || 'Carrier'} • ${carrier.city || ''}${carrier.state ? `, ${carrier.state}` : ''}`;
          
          addSearchResult(
            results,
            carrier,
            'carrier',
            carrier.firm_name,
            `/firm/${carrier.id}`,
            'mdi:truck-flatbed',
            searchTerm,
            subtitle,
            ['carrier', 'company', 'business', 'broker', 'shipper']
          );
        }
      });
    } catch (error) {
      // Error searching carriers
    }

    // 3. Search Lanes (Common routes between origins and destinations)
    try {
      const { data: loads } = await getClient().models.Load?.list({
        filter: {
          or: [
            { origin: { contains: searchTerm } },
            { destination: { contains: searchTerm } }
          ]
        },
        limit: 20
      }) || { data: [] };

      // Group by unique lanes (origin-destination pairs)
      const laneMap = new Map<string, { origin: string; destination: string; count: number }>();
      
      loads?.forEach(load => {
        if (load.origin && load.destination) {
          const laneKey = `${load.origin}-${load.destination}`;
          if (laneMap.has(laneKey)) {
            const lane = laneMap.get(laneKey)!;
            lane.count++;
          } else {
            laneMap.set(laneKey, {
              origin: load.origin,
              destination: load.destination,
              count: 1
            });
          }
        }
      });

      // Add lanes to results
      laneMap.forEach((lane, laneKey) => {
        addSearchResult(
          results,
          { id: laneKey },
          'lane',
          `${lane.origin} → ${lane.destination}`,
          `/firm/load-board?lane=${encodeURIComponent(laneKey)}`,
          'mdi:map-marker-path',
          searchTerm,
          `${lane.count} load${lane.count !== 1 ? 's' : ''}`,
          ['route', 'corridor', 'lane']
        );
      });
    } catch (error) {
      // Error searching lanes
    }

    // 4. Search Contacts (Users)
    try {
      const { data: contacts } = await getClient().models.User?.list({
        filter: {
          or: [
            { email: { contains: searchTerm } },
            { first_name: { contains: searchTerm } },
            { last_name: { contains: searchTerm } },
            { phone: { contains: searchTerm } }
          ]
        },
        limit: 10
      }) || { data: [] };

      contacts?.forEach(contact => {
        if (contact.id && (contact.email || contact.first_name || contact.last_name)) {
          const fullName = [contact.first_name, contact.last_name].filter(Boolean).join(' ') || 'Contact';
          const subtitle = contact.email || contact.phone || '';
          
          addSearchResult(
            results,
            contact,
            'contact',
            fullName,
            `/firm/users/${contact.id}`,
            'mdi:account-circle',
            searchTerm,
            subtitle,
            ['person', 'contact', 'user', 'team', 'member']
          );
        }
      });
    } catch (error) {
      // Error searching contacts
    }

    // 5. Search Documents (with OCR'd fields)
    // Note: This assumes you have a Document model with OCR fields
    // Adjust based on your actual document schema
    try {
      // If you have a Document model, uncomment and adjust:
      /*
      const { data: documents } = await getClient().models.Document?.list({
        filter: {
          or: [
            { document_name: { contains: searchTerm } },
            { document_type: { contains: searchTerm } },
            { ocr_content: { contains: searchTerm } },
            { extracted_text: { contains: searchTerm } }
          ]
        },
        limit: 10
      }) || { data: [] };

      documents?.forEach(doc => {
        if (doc.id) {
          addSearchResult(
            results,
            doc,
            'document',
            doc.document_name || 'Document',
            `/firm/documents/${doc.id}`,
            'mdi:file-document',
            searchTerm,
            doc.document_type || '',
            ['document', 'file', 'pdf', 'ocr']
          );
        }
      });
      */
    } catch (error) {
      // Error searching documents
    }
    
    return results;
  } catch (error) {
    // Search error
    return [];
  }
};

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  delay: number
): ((...args: Parameters<F>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};
