export interface Restaurant {
  _id: string;

  name: string;

  description?: string;

  cuisine?: string;

  area?: string;

  address?: string;

  phone?: string;

  price?: number;

  rating: number;

  ratingCount: number;

  image?: string;

  openingTime?: string;

  closingTime?: string;

  location?: {
    type: "Point";

    coordinates: [number, number];
  };
}

// =====================================================
// RAG Restaurant
// =====================================================

export interface RagRestaurant
  extends Restaurant {
  score: number;
}

// =====================================================
// Pagination
// =====================================================

export interface Pagination {
  page: number;

  limit: number;

  totalRestaurants: number;

  totalPages: number;
}

// =====================================================
// Restaurants Response
// =====================================================

export interface RestaurantsResponse {
  success: boolean;

  message?: string;

  data: Restaurant[];

  pagination: Pagination;
}

// =====================================================
// RAG Filters
// =====================================================

export interface RagFilters {
  search: string;

  cuisine: string;

  area: string;

  minPrice: number | null;

  maxPrice: number | null;

  minRating: number | null;

  sort: string;
}

// =====================================================
// RAG Response
// =====================================================

export interface RagResponse {
  success: boolean;

  data: {
    answer: string;

    restaurants: RagRestaurant[];

    filters: RagFilters;
  };
}

// =====================================================
// Chat Message
// =====================================================

export interface ChatMessage {
  _id?: string;

  role:
    | "user"
    | "assistant";

  content: string;

  createdAt?: string;
}

// =====================================================
// Chat Response
// =====================================================

export interface ChatResponse {
  success: boolean;

  data: {
    conversationId: string;

    answer: string;

    restaurants: RagRestaurant[];

    filters: RagFilters;
  };
}

// =====================================================
// Conversation Summary
// =====================================================

export interface ConversationSummary {
  _id: string;

  title: string;

  messageCount: number;

  createdAt: string;

  updatedAt: string;
}

// =====================================================
// Conversation
// =====================================================

export interface Conversation {
  _id: string;

  userId?: string | null;

  messages: ChatMessage[];

  createdAt: string;

  updatedAt: string;
}