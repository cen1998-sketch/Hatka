import { baseApi } from "../../../shared/api/baseApi.ts";

export interface ModerationUnit {
  id: string;
  unitType: 'listing' | 'room';
  displayTitle: string;
  type?: string;
  city?: string;
  address?: string;
  pricePerDay?: number;
  photos?: any[];
  amenities?: any;
  description?: string;
  area?: number;
  capacityAdults?: number;
  capacityChildren?: number;
  beds?: any;
  host: {
    id: string;
    firstName: string;
    email: string;
  };
}

export const moderationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPendingUnits: builder.query<{ success: boolean; data: ModerationUnit[] }, void>({
      query: () => "/moderation/pending",
      providesTags: ["Listing", "Room"],
    }),
    getPublishedUnits: builder.query<{ success: boolean; data: ModerationUnit[] }, void>({
      query: () => "/moderation/published",
      providesTags: ["Listing", "Room"],
    }),
    approveUnit: builder.mutation<{ success: boolean; data: any }, { id: string; type: string }>({
      query: ({ id, type }) => ({
        url: `/moderation/approve/${id}?type=${type}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Listing", "Room"],
    }),
    rejectUnit: builder.mutation<{ success: boolean; data: any }, { id: string; type: string; comment: string; details: any }>({
      query: ({ id, type, comment, details }) => ({
        url: `/moderation/reject/${id}?type=${type}`,
        method: "PATCH",
        body: { comment, details },
      }),
      invalidatesTags: ["Listing", "Room"],
    }),
  }),
});

export const {
  useGetPendingUnitsQuery,
  useGetPublishedUnitsQuery,
  useApproveUnitMutation,
  useRejectUnitMutation,
} = moderationApi;
