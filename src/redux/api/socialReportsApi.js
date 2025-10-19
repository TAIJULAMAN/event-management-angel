import { baseApi } from "./baseApi";

export const socialFeedReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    findAllSocialFeedReports: builder.query({
      query: ({ searchTerm = "", page = 1, limit = 10 }) => ({
        url: `social_feed_report/find_by_all_social_feed_report?searchTerm=${searchTerm}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response) => ({
        data: response.data,
      }),
      providesTags: ["socialFeedReport"],
    }),
    deleteSocialFeedReport: builder.mutation({
      query: (id) => ({
        url: `social_feed_report/delete_social_feed_report/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["socialFeedReport"],
    }),
  }),
});

export const { useFindAllSocialFeedReportsQuery, useDeleteSocialFeedReportMutation } = socialFeedReportApi;