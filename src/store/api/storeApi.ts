import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Store } from '@/data/mockStores';

// http://localhost:4000/api/store/001
export const storeApi = createApi({
  reducerPath: 'storeApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }), // Adjust baseUrl as needed
  endpoints: (builder) => ({
    getStoreById: builder.query<Store, string>({
      query: (storeId) => `/stores/${storeId}`,
    }),
  }),
});

export const { useGetStoreByIdQuery, useLazyGetStoreByIdQuery } = storeApi; 