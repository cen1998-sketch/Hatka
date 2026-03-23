import { baseApi } from '../../../shared/api/baseApi.ts'

export const searchApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    searchListings: build.query<any, any>({
      query: (params) => ({
        url: '/listings/search',
        params,
      }),
      providesTags: ['Listing'],
    }),
  }),
})

export const { useSearchListingsQuery } = searchApi
