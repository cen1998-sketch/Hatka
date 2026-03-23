import { baseApi } from '../../../shared/api/baseApi.ts'

export interface LocationSuggestion {
  id: string
  name: string
  region: string
}

export const locationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSuggestions: build.query<LocationSuggestion[], string>({
      query: (q) => `/locations/suggest?q=${encodeURIComponent(q)}`,
      transformResponse: (response: { success: boolean, data: LocationSuggestion[] }) => response.data,
      keepUnusedDataFor: 300,
    }),
  }),
})

export const { useGetSuggestionsQuery } = locationApi
