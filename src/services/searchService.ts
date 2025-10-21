import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

type SearchResultType = 
  | 'load' 
  | 'truck' 
  | 'user' 
  | 'firm' 
  | 'document'
  | 'business-profile'
  | 'admin-console'
  | 'settings'
  | 'notification';

interface SearchResult {
  id: string;
  title: string;
  type: SearchResultType;
  path: string;
  subtitle?: string;
  icon?: string;
  relevance?: number; // For sorting results by relevance
}

// System-wide searchable features
const systemFeatures: Array<{
  id: string;
  title: string;
  type: SearchResultType;
  path: string;
  icon: string;
  keywords: string[];
}> = [
  {
    id: 'load-board',
    title: 'Load Board',
    type: 'load',
    path: '/load-board',
    icon: 'mdi:truck-delivery',
    keywords: ['loads', 'shipments', 'freight', 'deliveries']
  },
  {
    id: 'truck-board',
    title: 'Truck Board',
    type: 'truck',
    path: '/firm/truck-board',
    icon: 'mdi:truck',
    keywords: ['trucks', 'vehicles', 'fleet']
  },
  {
    id: 'business-profile',
    title: 'Business Profile',
    type: 'business-profile',
    path: '/business-profile',
    icon: 'mdi:office-building',
    keywords: ['company', 'profile', 'business', 'firm']
  },
  {
    id: 'admin-console',
    title: 'Admin Console',
    type: 'admin-console',
    path: '/firm/admin',
    icon: 'mdi:shield-account',
    keywords: ['administration', 'settings', 'users', 'permissions']
  },
  {
    id: 'settings',
    title: 'Settings',
    type: 'settings',
    path: '/settings',
    icon: 'mdi:cog',
    keywords: ['preferences', 'configuration', 'setup']
  },
  {
    id: 'notifications',
    title: 'Notifications',
    type: 'notification',
    path: '/notifications',
    icon: 'mdi:bell',
    keywords: ['alerts', 'updates', 'messages']
  }
];

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
    
    // 1. Search system features
    systemFeatures.forEach(feature => {
      addSearchResult(
        results,
        { id: feature.id },
        feature.type,
        feature.title,
        feature.path,
        feature.icon,
        searchTerm,
        '',
        feature.keywords
      );
    });

    // 2. Search loads
    try {
      const { data: loads } = await client.models.Load?.list({
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
      console.error('Error searching loads:', error);
    }

    // 3. Search firms
    try {
      const { data: firms } = await client.models.Firm?.list({
        filter: {
          or: [
            { firm_name: { contains: searchTerm } },
            { address: { contains: searchTerm } },
            { city: { contains: searchTerm } },
            { state: { contains: searchTerm } },
            { firm_type: { contains: searchTerm } }
          ]
        },
        limit: 5
      }) || { data: [] };

      firms?.forEach(firm => {
        if (firm.id && firm.firm_name) {
          const subtitle = `${firm.firm_type || 'Firm'} • ${firm.city || ''}${firm.state ? `, ${firm.state}` : ''}`;
          
          addSearchResult(
            results,
            firm,
            'firm',
            firm.firm_name,
            `/firm/${firm.id}`,
            'mdi:office-building',
            searchTerm,
            subtitle,
            ['company', 'business', 'organization']
          );
        }
      });
    } catch (error) {
      console.error('Error searching firms:', error);
    }

    // 4. Search users by email
    try {
      const { data: users } = await client.models.User?.list({
        filter: {
          or: [
            { email: { contains: searchTerm } },
            { first_name: { contains: searchTerm } },
            { last_name: { contains: searchTerm } },
            { phone: { contains: searchTerm } }
          ]
        },
        limit: 5
      }) || { data: [] };

      users?.forEach(user => {
        if (user.id && user.email) {
          const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'User';
          const subtitle = user.email;
          
          addSearchResult(
            results,
            user,
            'user',
            fullName,
            `/firm/users/${user.id}`,
            'mdi:account',
            searchTerm,
            subtitle,
            ['person', 'contact', 'team', 'member']
          );
        }
      });
    } catch (error) {
      console.error('Error searching users:', error);
    }

    // Search users
    try {
      const { data: users } = await client.models.User?.list({
        filter: {
          or: [
            { first_name: { contains: searchTerm } },
            { last_name: { contains: searchTerm } },
            { email: { contains: searchTerm } }
          ]
        },
        limit: 5
      }) || { data: [] };

      users?.forEach(user => {
        if (user.id && (user.first_name || user.last_name || user.email)) {
          const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
          results.push({
            id: user.id,
            title: fullName || user.email || 'User',
            type: 'user',
            path: `/users/${user.id}`,
            subtitle: user.email || 'No email',
            icon: 'mdi:account'
          });
        }
      });
    } catch (error) {
      console.error('Error searching users:', error);
    }
    
    return results;
  } catch (error) {
    console.error('Search error:', error);
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
