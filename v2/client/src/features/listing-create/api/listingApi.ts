import { baseApi } from '../../../shared/api/baseApi'

export const listingCreateApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getListing: build.query<any, string>({
      query: (id) => `/listings/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Listing', id }],
    }),
    getMyListings: build.query<any, void>({
      query: () => '/listings/my',
      providesTags: ['Listing'],
    }),
    createListing: build.mutation<any, { type: string; stepsCompleted?: number }>({
      query: (body) => ({
        url: '/listings',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Listing'],
    }),
    updateListing: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/listings/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Listing', id }, 'Listing'],
    }),
    updateStep: build.mutation<any, { id: string; step: number; data: any }>({
      query: ({ id, step, data }) => ({
        url: `/listings/${id}/step/${step}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Listing', id }, 'Listing'],
    }),
    publishListing: build.mutation<any, string>({
      query: (id) => ({
        url: `/listings/${id}/publish`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Listing', id }, 'Listing'],
    }),
    deleteListing: build.mutation<any, string>({
      query: (id) => ({
        url: `/listings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Listing'],
    }),
    uploadPhoto: build.mutation<any, { id: string; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData()
        formData.append('photo', file)
        return {
          url: `/listings/${id}/photos`,
          method: 'POST',
          body: formData,
        }
      },
      transformResponse: (response: any) => response.data,
    }),
    deleteListingPhoto: build.mutation<void, { id: string; photoId: string }>({
      query: ({ id, photoId }) => ({
        url: `/listings/${id}/photos/${photoId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Listing', id }],
    }),
    reorderListingPhotos: build.mutation<void, { id: string; photos: any[] }>({
      query: ({ id, photos }) => ({
        url: `/listings/${id}/photos/reorder`,
        method: 'PATCH',
        body: { photos },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Listing', id }],
    }),
    getRooms: build.query<any, string>({
      query: (id) => `/listings/${id}/rooms`,
      providesTags: (result, _error, id) => 
        result ? [...result.data.map(({ id: roomId }: any) => ({ type: 'Room' as const, id: roomId })), { type: 'Listing', id }] : [{ type: 'Listing', id }],
    }),
    addRoom: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/listings/${id}/rooms`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Listing', id }],
    }),
    updateRoom: build.mutation<any, { roomId: string; data: any }>({
      query: ({ roomId, data }) => ({
        url: `/listings/rooms/${roomId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { roomId }) => [{ type: 'Room', id: roomId }],
    }),
    deleteRoom: build.mutation<any, string>({
      query: (roomId) => ({
        url: `/listings/rooms/${roomId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Listing'],
    }),
    uploadRoomPhoto: build.mutation<any, { id: string; roomId: string; file: File }>({
      query: ({ id, roomId, file }) => {
        const formData = new FormData()
        formData.append('photo', file)
        return {
          url: `/listings/${id}/rooms/${roomId}/photos`,
          method: 'POST',
          body: formData,
        }
      },
      transformResponse: (response: any) => response.data,
      invalidatesTags: (_result, _error, { roomId }) => [{ type: 'Room', id: roomId }],
    }),
    deleteRoomPhoto: build.mutation<void, { id: string; roomId: string; photoId: string }>({
      query: ({ id, roomId, photoId }) => ({
        url: `/listings/${id}/rooms/${roomId}/photos/${photoId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { roomId }) => [{ type: 'Room', id: roomId }],
    }),
    reorderRoomPhotos: build.mutation<void, { id: string; roomId: string; photos: any[] }>({
      query: ({ id, roomId, photos }) => ({
        url: `/listings/${id}/rooms/${roomId}/photos/reorder`,
        method: 'PATCH',
        body: { photos },
      }),
      invalidatesTags: (_result, _error, { roomId }) => [{ type: 'Room', id: roomId }],
    }),
    getOwnerBookings: build.query<any, void>({
      query: () => '/bookings/owner',
      providesTags: ['Booking'],
    }),
  }),
  overrideExisting: false,
})

export const { 
  useGetListingQuery,
  useGetMyListingsQuery,
  useCreateListingMutation, 
  useUpdateListingMutation,
  useUpdateStepMutation,
  usePublishListingMutation,
  useDeleteListingMutation,
  useUploadPhotoMutation,
  useDeleteListingPhotoMutation,
  useReorderListingPhotosMutation,
  useGetRoomsQuery,
  useAddRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useUploadRoomPhotoMutation,
  useDeleteRoomPhotoMutation,
  useReorderRoomPhotosMutation,
  useGetOwnerBookingsQuery,
} = listingCreateApi
