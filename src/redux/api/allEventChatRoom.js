import {baseApi} from "./baseApi";

export const allEventChatRoomApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllEventChatRoom: builder.query({
            query: (params) => ({
                url: "event_chat_room/find_by_all_event_chatroom",
                method: "GET",
                params: {
                    ...params,
                },
            }),
            providesTags: ["allEventChatRoom"],
        }),
        specificEventWiseConversation: builder.query({
            query: ({ eventId, page, limit }) => ({
                url: `conversation/specific_event_wise_conversation/${eventId}`,
                method: "GET",
                params: {
                    ...(page ? { page } : {}),
                    ...(limit ? { limit } : {}),
                },
            }),
            providesTags: ["specificEventWiseConversation"],
        }),
    }),
});

export const { useGetAllEventChatRoomQuery, useSpecificEventWiseConversationQuery } = allEventChatRoomApi;
