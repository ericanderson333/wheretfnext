export interface Location {
  placeId: string;
  name: string;
  address: string;
  types: string[];
  rating?: number;
  photos?: string[];
}

export interface Vote {
  location: Location;
  voterId: string;
  timestamp: Date;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  expiresAt?: Date;
  hostId: string;
  votes: Vote[];
  status: 'active' | 'closed';
  shareCode: string;
} 