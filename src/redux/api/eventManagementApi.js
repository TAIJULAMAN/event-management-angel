// eventManagementApi.js
import { baseApi } from "./baseApi";

export const eventManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEvents: builder.query({
      query: ({ searchTerm = "", page = 1, limit = 10 }) => ({
        url: `event/find_by_all_event?searchTerm=${searchTerm}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response) => ({
        data: response.data.all_event,
        meta: response.data.meta
      }),
      providesTags: ["events"],
    }),
  }),
});

export const { useGetAllEventsQuery } = eventManagementApi;