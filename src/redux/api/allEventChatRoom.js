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
    }),
});

export const { useGetAllEventChatRoomQuery } = allEventChatRoomApi;
