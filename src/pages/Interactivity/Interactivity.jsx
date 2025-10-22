import { ConfigProvider, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import PageHeading from "../../components/PageHeading/PageHeading";
import { TiMessages } from "react-icons/ti";
import { useGetAllEventChatRoomQuery, useSpecificEventWiseConversationQuery } from "../../redux/api/allEventChatRoom";
import { format } from 'date-fns';
import { getImageUrl } from "../../config/envConfig";
import useDebounce from "../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import defaultIMG from "../../assets/defaultImg";


function AllEventChatroom() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

    const [editTitle, setEditTitle] = useState("");
    const [addTitle, setAddTitle] = useState("");
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);

    const navigate = useNavigate();
    // const showModal = (eventId) => {
    //     setIsModalOpen(true);
    //     setSelectedUser(eventId);
    // };

    const { data: allEventChatRoomData, isLoading } = useGetAllEventChatRoomQuery({
        page: pagination.current,
        limit: pagination.pageSize,
        searchTerm: debouncedSearch,
    });

    const { data: conversationData, isLoading: isConversationLoading, error: conversationError } = useSpecificEventWiseConversationQuery(
        { eventId: selectedUser },
        { skip: !isModalOpen || !selectedUser }
    );

    useEffect(() => {
        const total = allEventChatRoomData?.data?.meta?.total;
        if (typeof total === 'number') {
            setPagination((prev) => ({ ...prev, total }));
        }
    }, [allEventChatRoomData]);

    // const showModal = () => {
    //     setIsModalOpen(true);
    // };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // const showEditModal = (user) => {
    //     setSelectedUser(user);
    //     setEditTitle(user.title);
    //     setIsEditModalOpen(true);
    // };
    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
        setEditTitle("");
    };

    const handleEditSubmit = () => {
        console.log('Edit data:', { id: selectedUser.key, title: editTitle });
        setIsEditModalOpen(false);
        setSelectedUser(null);
        setEditTitle("");
    };

    // const showAddModal = () => {
    //     setIsAddModalOpen(true);
    // };
    const handleAddCancel = () => {
        setIsAddModalOpen(false);
        setAddTitle("");
    };

    const handleAddSubmit = () => {
        console.log('Add data:', { title: addTitle });
        setIsAddModalOpen(false);
        setAddTitle("");
    };
    const dataSource = allEventChatRoomData?.data?.all_event_chatroom?.map((item, index) => ({
        key: item._id,
        no: (pagination.current - 1) * pagination.pageSize + index + 1,
        eventTitle: item?.eventId?.event_title || item?.chatRoomName || 'N/A',
        eventPhoto: item?.eventId?.photo || null,
        chatRoomName: item?.chatRoomName || 'N/A',
        totalMember: typeof item?.totalMember === 'number' ? item.totalMember : 0,
        createdAt: item?.createdAt,
        eventId: item?.eventId?._id,
    })) || [];

    const columns = [
        {
            title: "No",
            dataIndex: "no",
            key: "no",
            width: 70,
        },
        {
            title: "Event",
            key: "event",
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <img
                        src={getImageUrl(record.eventPhoto) || `${defaultIMG}`}
                        alt="Event"
                        className="w-10 h-10 object-cover rounded-md"
                    />
                    <span className="leading-none">{record.eventTitle}</span>
                </div>
            ),
        },
        {
            title: "Chat Room",
            dataIndex: "chatRoomName",
            key: "chatRoomName",
        },
        {
            title: "Members",
            dataIndex: "totalMember",
            key: "totalMember",
            width: 110,
        },
        {
            title: "Created At",
            key: "createdAt",
            width: 160,
            render: (_, record) => (
                <span>{record.createdAt ? format(new Date(record.createdAt), 'MMM dd, yyyy') : 'N/A'}</span>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div className="flex gap-2">
                    <button className="" onClick={
                        () => {
                        //  showModal(record?.eventId);  
                        navigate(`/chat/${record?.eventId}`);
                        }
                    }>
                        <TiMessages  className="text-[#00c0b5] w-10 h-10 cursor-pointer rounded-md" />
                    </button>
                    
                </div>
            ),
        },
    ];

    const handleTableChange = (newPagination) => {
        setPagination({
            ...pagination,
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        });
    };

    return (
        <>
            <div className="my-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <PageHeading title="All Event Chatroom" />
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-[300px]">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}

                            className="border border-[#e5eaf2] py-3 pl-12 pr-4 outline-none w-full rounded-md"
                        />
                        <span className="text-gray-500 absolute top-0 left-0 h-full px-3 flex items-center justify-center cursor-pointer">
                            <IoSearch className="text-[1.3rem]" />
                        </span>
                    </div>
                    {/* <button
                        onClick={showAddModal}
                        className="bg-gradient-to-r from-[#00c0b5] to-[#00a89b] text-white border-none hover:from-[#00a89b] hover:to-[#009688] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-3 rounded-md font-semibold whitespace-nowrap"
                    >
                        + Add New
                    </button> */}
                </div>
            </div>
            <ConfigProvider
                theme={{
                    components: {
                        InputNumber: {
                            activeBorderColor: "#00c0b5",
                        },
                        Pagination: {
                            colorPrimaryBorder: "#00c0b5",
                            colorBorder: "#00c0b5",
                            colorPrimaryHover: "#00c0b5",
                            colorTextPlaceholder: "#00c0b5",
                            itemActiveBgDisabled: "#00c0b5",
                            colorPrimary: "#00c0b5",
                        },
                        Table: {
                            headerBg: "#00c0b5",
                            headerColor: "rgb(255,255,255)",
                            cellFontSize: 16,
                            headerSplitColor: "#00c0b5",
                        },
                    },
                }}
            >
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    loading={isLoading}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: false,
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: "max-content" }}
                />
                {/* Delete Modal */}
                <Modal
                    open={isModalOpen}
                    centered
                    onCancel={handleCancel}
                    footer={null}
                    width={700}
                    title="Event Conversations"
                >
                    <div className="py-2">
                        {isConversationLoading && (
                            <div className="py-8 text-center text-gray-500">Loading conversations...</div>
                        )}
                        {!isConversationLoading && conversationError && (
                            <div className="py-8 text-center text-red-500">Failed to load conversations.</div>
                        )}
                        {!isConversationLoading && !conversationError && (
                            <div className="space-y-4">
                                {(conversationData?.data?.allConversations || []).length === 0 ? (
                                    <div className="py-8 text-center text-gray-500">No conversations found.</div>
                                ) : (
                                    (conversationData?.data?.allConversations || []).map((conv) => (
                                        <div key={conv._id} className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="inline-flex items-center gap-2">
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#00c0b5]/10 text-[#00a89b]">
                                                        {conv.chat?.toUpperCase() || 'GROUP'}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-500">{conv.createdAt ? format(new Date(conv.createdAt), 'MMM dd, yyyy') : ''}</div>
                                            </div>
                                            <div className="flex -space-x-2 mb-3">
                                                {(conv.participants || []).map((p) => (
                                                    <img
                                                        key={p._id}
                                                        src={getImageUrl(p.photo) || `${defaultIMG}`}
                                                        alt={p.name}
                                                        className="w-9 h-9 rounded-full border-2 border-white object-cover"
                                                    />
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                                                {(conv.participants || []).map((p) => (
                                                    <div key={p._id} className="text-sm">
                                                        <div className="font-medium">{p.name}</div>
                                                        <div className="text-gray-500">{p.email}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => navigate(`/chat/${conv._id}`)}
                                                    className="px-4 py-2 bg-gradient-to-r from-[#00c0b5] to-[#00a89b] text-white rounded-md hover:from-[#00a89b] hover:to-[#009688] transition-all"
                                                >
                                                    Go to conversation
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </Modal>

                {/* Edit Modal */}
                <Modal
                    open={isEditModalOpen}
                    centered
                    onCancel={handleEditCancel}
                    footer={null}
                    width={500}
                    title="Edit all-event-chatroom Item"
                >
                    {selectedUser && (
                        <div className="py-4">
                            <div className="mb-6">
                                <label className="block mb-2 text-sm font-semibold text-gray-700">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="Enter title"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#00c0b5] focus:ring-2 focus:ring-[#00c0b5]/20 transition-all"
                                />
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <button
                                    onClick={handleEditCancel}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEditSubmit}
                                    className="px-6 py-2 bg-gradient-to-r from-[#00c0b5] to-[#00a89b] text-white rounded-lg hover:from-[#00a89b] hover:to-[#009688] transition-all transform hover:scale-105 shadow-lg"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Add Modal */}
                <Modal
                    open={isAddModalOpen}
                    centered
                    onCancel={handleAddCancel}
                    footer={null}
                    width={500}
                    title="Add New all-event-chatroom Item"
                >
                    <div className="py-4">
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-semibold text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                value={addTitle}
                                onChange={(e) => setAddTitle(e.target.value)}
                                placeholder="Enter title"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#00c0b5] focus:ring-2 focus:ring-[#00c0b5]/20 transition-all"
                            />
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <button
                                onClick={handleAddCancel}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddSubmit}
                                className="px-6 py-2 bg-gradient-to-r from-[#00c0b5] to-[#00a89b] text-white rounded-lg hover:from-[#00a89b] hover:to-[#009688] transition-all transform hover:scale-105 shadow-lg"
                            >
                                Add Item
                            </button>
                        </div>
                    </div>
                </Modal>
            </ConfigProvider>
        </>
    );
}

export default AllEventChatroom;