import { apiSlice } from "../apiSlice";

import type {
  Restaurant,
  Pagination,
  RagResponse,
  ChatResponse,
  Conversation,
  ConversationSummary,
} from "@/types/restaurant";

// =====================================================
// Responses
// =====================================================

interface RestaurantsResponse {
  success: boolean;
  message?: string;
  pagination: Pagination;
  data: Restaurant[];
}

interface RestaurantResponse {
  success: boolean;
  message?: string;
  data: Restaurant;
}

// =====================================================
// Filters
// =====================================================

interface RestaurantFilters {
  search?: string;
  cuisine?: string;
  area?: string;

  minPrice?: number;
  maxPrice?: number;
  minRating?: number;

  sort?: string;

  latitude?: number;
  longitude?: number;
  distance?: number;

  page?: number;
  limit?: number;
}

// =====================================================
// Restaurant Data
// =====================================================

export interface RestaurantData {
  name: string;

  description?: string;

  cuisine?: string;

  area?: string;

  price?: number;

  image?: string;

  location?: {
    type: "Point";
    coordinates: [number, number];
  };
}

// =====================================================
// API
// =====================================================

export const restaurantApi =
  apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      // =============================================
      // OLD AI SEARCH
      // =============================================

      aiSearch: builder.mutation<
        {
          success: boolean;

          data: {
            search: string;
            cuisine: string;
            area: string;

            minPrice: number | null;
            maxPrice: number | null;
            minRating: number | null;

            sort: string;
          };
        },
        {
          query: string;
        }
      >({
        query: (body) => ({
          url: "/ai/search",
          method: "POST",
          body,
        }),
      }),

      // =============================================
      // RAG SEARCH
      // =============================================

      ragSearch: builder.mutation<
        RagResponse,
        {
          query: string;
          limit?: number;
        }
      >({
        query: (body) => ({
          url: "/ai/rag",
          method: "POST",
          body,
        }),
      }),

      // =============================================
      // RAG CHAT
      // =============================================

      ragChat: builder.mutation<
        ChatResponse,
        {
          conversationId?: string;
          message: string;
          limit?: number;
        }
      >({
        query: (body) => ({
          url: "/ai/chat",
          method: "POST",
          body,
        }),
      }),

      // =============================================
      // GET ALL CONVERSATIONS
      // =============================================

      getConversations: builder.query<
        {
          success: boolean;
          data: ConversationSummary[];
        },
        void
      >({
        query: () => ({
          url: "/ai/chat",
          method: "GET",
        }),
      }),

      // =============================================
      // GET ONE CONVERSATION
      // =============================================

      getConversation: builder.query<
        {
          success: boolean;
          data: Conversation;
        },
        string
      >({
        query: (conversationId) => ({
          url: `/ai/chat/${conversationId}`,
          method: "GET",
        }),
      }),

      // =============================================
      // DELETE CONVERSATION
      // =============================================

      deleteConversation: builder.mutation<
        {
          success: boolean;
          message: string;
        },
        string
      >({
        query: (conversationId) => ({
          url: `/ai/chat/${conversationId}`,
          method: "DELETE",
        }),
      }),

      // =============================================
      // GET ALL RESTAURANTS
      // =============================================

      getRestaurants: builder.query<
        RestaurantsResponse,
        RestaurantFilters
      >({
        query: (params) => ({
          url: "/restaurants",
          method: "GET",
          params,
        }),

        providesTags: (result) =>
          result
            ? [
                ...result.data.map((restaurant) => ({
                  type: "Restaurant" as const,
                  id: restaurant._id,
                })),

                {
                  type: "Restaurant",
                  id: "LIST",
                },
              ]
            : [
                {
                  type: "Restaurant",
                  id: "LIST",
                },
              ],
      }),

      // =============================================
      // GET RESTAURANT BY ID
      // =============================================

      getRestaurantById: builder.query<
        RestaurantResponse,
        string
      >({
        query: (id) => ({
          url: `/restaurants/${id}`,
          method: "GET",
        }),

        providesTags: (result, error, id) => [
          {
            type: "Restaurant",
            id,
          },
        ],
      }),

      // =============================================
      // GET NEARBY
      // =============================================

      getNearbyRestaurants: builder.query<
        RestaurantsResponse,
        {
          longitude: number;
          latitude: number;
          distance?: number;
        }
      >({
        query: (params) => ({
          url: "/restaurants/nearby",
          method: "GET",
          params,
        }),

        providesTags: (result) =>
          result
            ? [
                ...result.data.map((restaurant) => ({
                  type: "Restaurant" as const,
                  id: restaurant._id,
                })),

                {
                  type: "Restaurant",
                  id: "NEARBY",
                },
              ]
            : [
                {
                  type: "Restaurant",
                  id: "NEARBY",
                },
              ],
      }),

      // =============================================
      // CREATE
      // =============================================

      createRestaurant: builder.mutation<
        RestaurantResponse,
        RestaurantData
      >({
        query: (data) => ({
          url: "/restaurants",
          method: "POST",
          body: data,
        }),

        invalidatesTags: [
          {
            type: "Restaurant",
            id: "LIST",
          },

          {
            type: "Restaurant",
            id: "NEARBY",
          },
        ],
      }),

      // =============================================
      // UPDATE
      // =============================================

      updateRestaurant: builder.mutation<
        RestaurantResponse,
        {
          id: string;
          data: Partial<RestaurantData>;
        }
      >({
        query: ({ id, data }) => ({
          url: `/restaurants/${id}`,
          method: "PUT",
          body: data,
        }),

        invalidatesTags: (result, error, { id }) => [
          {
            type: "Restaurant",
            id,
          },

          {
            type: "Restaurant",
            id: "LIST",
          },

          {
            type: "Restaurant",
            id: "NEARBY",
          },
        ],
      }),

      // =============================================
      // DELETE
      // =============================================

      deleteRestaurant: builder.mutation<
        {
          success: boolean;
          message: string;
        },
        string
      >({
        query: (id) => ({
          url: `/restaurants/${id}`,
          method: "DELETE",
        }),

        invalidatesTags: (result, error, id) => [
          {
            type: "Restaurant",
            id,
          },

          {
            type: "Restaurant",
            id: "LIST",
          },

          {
            type: "Restaurant",
            id: "NEARBY",
          },
        ],
      }),
    }),

    overrideExisting: false,
  });

// =====================================================
// Hooks
// =====================================================

export const {
  useGetRestaurantsQuery,
  useGetRestaurantByIdQuery,
  useGetNearbyRestaurantsQuery,

  useAiSearchMutation,
  useRagSearchMutation,

  useRagChatMutation,

  useGetConversationsQuery,

  useGetConversationQuery,
  useLazyGetConversationQuery,

  useDeleteConversationMutation,

  useCreateRestaurantMutation,
  useUpdateRestaurantMutation,
  useDeleteRestaurantMutation,
} = restaurantApi;