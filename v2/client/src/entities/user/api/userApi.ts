import { baseApi } from "../../../shared/api/baseApi.ts";

export interface UserProfileResponse {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  city: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
}

export interface SubscriptionResponse {
  daysRemaining: number;
  expiresAt: string | null;
  status: 'ACTIVE' | 'EXPIRED' | 'INACTIVE';
}

export interface ReferralStatsResponse {
  referrals: any[];
  totalEarned: number;
  referralCode: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<{ success: boolean; data: UserProfileResponse }, void>({
      query: () => "/profile",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<{ success: boolean; data: UserProfileResponse }, Partial<UserProfileResponse>>({
      query: (body) => ({
        url: "/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    getSubscription: builder.query<{ success: boolean; data: SubscriptionResponse }, void>({
      query: () => "/profile/subscription",
      providesTags: ["Subscription"],
    }),
    getReferralStats: builder.query<{ success: boolean; data: ReferralStatsResponse }, void>({
      query: () => "/referral/stats",
      providesTags: ["Referral"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetSubscriptionQuery,
  useGetReferralStatsQuery,
} = userApi;
