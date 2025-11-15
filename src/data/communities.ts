export interface Community {
  id: string;
  name: string;
  shortName: string;
  description: string;
  location: string;
  type: 'university' | 'college' | 'city' | 'organization';
  memberCount: number;
  imageUrl?: string;
  createdAt: Date;
}

// HARDCODED: Placeholder communities for testing
export const MOCK_COMMUNITIES: Community[] = [
  {
    id: 'community-uw-madison',
    name: 'University of Wisconsin-Madison',
    shortName: 'UW-Madison',
    description: 'Badgers sharing style! Join the largest campus closet community.',
    location: 'Madison, WI',
    type: 'university',
    memberCount: 1247,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'community-uiuc',
    name: 'University of Illinois Urbana-Champaign',
    shortName: 'UIUC',
    description: 'Fighting Illini fashion collective. Share your outfits with fellow students!',
    location: 'Urbana-Champaign, IL',
    type: 'university',
    memberCount: 983,
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'community-northwestern',
    name: 'Northwestern University',
    shortName: 'Northwestern',
    description: 'Wildcats wardrobe exchange. Premium styles, sustainable sharing.',
    location: 'Evanston, IL',
    type: 'university',
    memberCount: 654,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'community-umich',
    name: 'University of Michigan',
    shortName: 'UMich',
    description: 'Go Blue! Share your Michigan style with the Wolverine community.',
    location: 'Ann Arbor, MI',
    type: 'university',
    memberCount: 1156,
    createdAt: new Date('2024-01-12'),
  },
  {
    id: 'community-osu',
    name: 'Ohio State University',
    shortName: 'OSU',
    description: 'Buckeye style network. Connect and share with fellow OSU students.',
    location: 'Columbus, OH',
    type: 'university',
    memberCount: 1389,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'community-purdue',
    name: 'Purdue University',
    shortName: 'Purdue',
    description: 'Boilermaker fashion community. Engineering style solutions together!',
    location: 'West Lafayette, IN',
    type: 'university',
    memberCount: 721,
    createdAt: new Date('2024-01-18'),
  },
  {
    id: 'community-msu',
    name: 'Michigan State University',
    shortName: 'MSU',
    description: 'Spartan style sharing. Go Green, dress sustainably!',
    location: 'East Lansing, MI',
    type: 'university',
    memberCount: 892,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'community-indiana',
    name: 'Indiana University',
    shortName: 'IU',
    description: 'Hoosier wardrobe collective. Share the cream and crimson spirit!',
    location: 'Bloomington, IN',
    type: 'university',
    memberCount: 567,
    createdAt: new Date('2024-01-22'),
  },
  {
    id: 'community-uchicago',
    name: 'University of Chicago',
    shortName: 'UChicago',
    description: 'Maroons fashion exchange. Intellectual style meets sustainable sharing.',
    location: 'Chicago, IL',
    type: 'university',
    memberCount: 445,
    createdAt: new Date('2024-01-25'),
  },
  {
    id: 'community-marquette',
    name: 'Marquette University',
    shortName: 'Marquette',
    description: 'Golden Eagles style community. Share your Milwaukee fashion!',
    location: 'Milwaukee, WI',
    type: 'university',
    memberCount: 328,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'community-notre-dame',
    name: 'University of Notre Dame',
    shortName: 'Notre Dame',
    description: 'Fighting Irish closet sharing. Classic style, modern sustainability.',
    location: 'Notre Dame, IN',
    type: 'university',
    memberCount: 612,
    createdAt: new Date('2024-02-05'),
  },
  {
    id: 'community-iowa',
    name: 'University of Iowa',
    shortName: 'Iowa',
    description: 'Hawkeyes fashion network. Black and gold style sharing!',
    location: 'Iowa City, IA',
    type: 'university',
    memberCount: 534,
    createdAt: new Date('2024-02-08'),
  },
  {
    id: 'community-depaul',
    name: 'DePaul University',
    shortName: 'DePaul',
    description: 'Blue Demons style exchange. Urban fashion meets campus community.',
    location: 'Chicago, IL',
    type: 'university',
    memberCount: 391,
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'community-loyola-chicago',
    name: 'Loyola University Chicago',
    shortName: 'Loyola Chicago',
    description: 'Ramblers wardrobe sharing. Lakefront style, sustainable choices.',
    location: 'Chicago, IL',
    type: 'university',
    memberCount: 267,
    createdAt: new Date('2024-02-12'),
  },
  {
    id: 'community-uw-milwaukee',
    name: 'University of Wisconsin-Milwaukee',
    shortName: 'UWM',
    description: 'Panthers fashion community. Milwaukee style, student savings!',
    location: 'Milwaukee, WI',
    type: 'university',
    memberCount: 423,
    createdAt: new Date('2024-02-15'),
  },
];

/**
 * Search communities by name, short name, location, or description
 */
export function searchCommunities(query: string): Community[] {
  if (!query.trim()) {
    return MOCK_COMMUNITIES;
  }

  const lowerQuery = query.toLowerCase().trim();

  return MOCK_COMMUNITIES.filter((community) => {
    return (
      community.name.toLowerCase().includes(lowerQuery) ||
      community.shortName.toLowerCase().includes(lowerQuery) ||
      community.location.toLowerCase().includes(lowerQuery) ||
      community.description.toLowerCase().includes(lowerQuery)
    );
  });
}

/**
 * Get a community by ID
 */
export function getCommunityById(id: string): Community | undefined {
  return MOCK_COMMUNITIES.find((community) => community.id === id);
}

/**
 * Get top communities by member count
 */
export function getTopCommunities(limit: number = 10): Community[] {
  return [...MOCK_COMMUNITIES]
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, limit);
}
