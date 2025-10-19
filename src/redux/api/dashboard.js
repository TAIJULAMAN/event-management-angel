import { baseApi } from "./baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardCount: builder.query({
      query: (params) => ({
        url: "auth/dashboard_count",
        method: "GET",
        params,
      }),
      providesTags: ["dashboard"],
    }),
    getUserGrowth: builder.query({
      query: (year) => ({
        url: "auth/user_graph",
        method: "GET",
        params: { year },
      }),
      providesTags: ["userGrowth"],
    }),
    getEventGrowth: builder.query({
      query: (year) => ({
        url: "event/get_event_growth",
        method: "GET",
        params: { year },
      }),
      providesTags: ["eventGrowth"],
    }),
  }),
});

export const { 
  useGetDashboardCountQuery, 
  useGetUserGrowthQuery, 
  useGetEventGrowthQuery 
} = dashboardApi;

export default dashboardApi;
