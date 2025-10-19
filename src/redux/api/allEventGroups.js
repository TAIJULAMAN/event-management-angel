import { baseApi } from "./baseApi";

export const allEventGroupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEventGroup: builder.query({
      query: ({ searchTerm = "", page = 1, limit = 10 }) => ({
        url: `join_group/find_by_all_join_eventgroup`,
        method: "GET",
        params: {
          searchTerm,
          page,
          limit,
        },
      }),
      transformResponse: (response) => ({
        data: response.data,
      }),
      providesTags: ["eventGroup"],
    }),
  }),
});

export const { useGetAllEventGroupQuery } = allEventGroupApi;