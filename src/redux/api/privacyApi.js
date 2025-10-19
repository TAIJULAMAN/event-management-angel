import { baseApi } from "./baseApi";

const privacyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrivacy: builder.query({
      query: () => ({
        url: "setting/find_by_privacy_policys",
        method: "GET",
      }),
      providesTags: ["privacy"],
      transformResponse: (response) => response.data?.PrivacyPolicy || "",
    }),

    updatePrivacy: builder.mutation({
      query: (privacyPolicy) => ({
        url: "setting/privacy_policys",
        method: "POST",
        body: { PrivacyPolicy: privacyPolicy },
      }),
      invalidatesTags: ["privacy"],
    }),
  }),
});

export const { useGetPrivacyQuery, useUpdatePrivacyMutation } = privacyApi;
