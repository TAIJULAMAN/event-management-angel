import { baseApi } from "../baseApi";

const findSpecificConversationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        findSpecificConversation: builder.query({
            query: (conversationId) => ({
                url: `message/find_by_specific_conversation/${conversationId}`,
                method: "GET",
            }),
            providesTags: ["findSpecificConversation"],
        }),
    }),
});

export const { useFindSpecificConversationQuery } = findSpecificConversationApi;
