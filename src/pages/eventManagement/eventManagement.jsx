import { ConfigProvider, Modal, Table } from "antd";
import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import PageHeading from "../../components/PageHeading/PageHeading";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { useGetAllEventsQuery } from "../../redux/api/eventManagementApi";
import { getImageUrl } from "../../config/envConfig";

function EventManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const { data: eventsData, isLoading, isFetching } = useGetAllEventsQuery({
        searchTerm,
        page: pagination.current,
        limit: pagination.pageSize,
    });

    useEffect(() => {
        if (eventsData?.meta) {
            setPagination(prev => ({
                ...prev,
                total: eventsData.meta.total || 0,
            }));
        }
    }, [eventsData]);

    const handleTableChange = (pagination) => {
        setPagination({
            current: pagination.current,
            pageSize: pagination.pageSize,
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const showModal = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const showViewModal = (event) => {
        setSelectedEvent(event);
        setIsViewModalOpen(true);
    };

    const handleViewCancel = () => {
        setIsViewModalOpen(false);
        setSelectedEvent(null);
    };

    const columns = [
        {
            title: "No",
            key: "no",
            render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: "Image",
            key: "image",
            render: (_, record) => (
                <img
                    src={getImageUrl(record.photo)}
                    className="w-20 h-10 object-cover"
                    alt="Event"
                />
            ),
        },
        {
            title: "Event Title",
            key: "event_title",
            render: (_, record) => record.event_title,
        },
        {
            title: "Host",
            key: "host",
            render: (_, record) => record.hostId?.name || 'N/A',
        },
        {
            title: "Date",
            key: "date",
            render: (_, record) => record.date,
        },
        {
            title: "Time",
            key: "time",
            render: (_, record) => `${record.starting_time} - ${record.ending_time}`,
        },
        {
            title: "Category",
            key: "category",
            render: (_, record) => record.event_category,
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div className="flex gap-2">
                    <button onClick={() => showViewModal(record)}>
                        <FaRegEye className="text-[#00c0b5] w-10 h-10 cursor-pointer rounded-md" />
                    </button>
                    <button onClick={() => showModal(record)}>
                        <RiDeleteBin6Line className="text-red-400 w-10 h-10 cursor-pointer rounded-md" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="my-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <PageHeading title="Event Management" />
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative w-full sm:w-[300px]">
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="border border-[#e5eaf2] py-3 pl-12 pr-4 outline-none w-full rounded-md"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <span className="text-gray-500 absolute top-0 left-0 h-full px-3 flex items-center justify-center cursor-pointer">
                            <IoSearch className="text-[1.3rem]" />
                        </span>
                    </div>
                </div>
            </div>
            
            <ConfigProvider
                theme={{
                    components: {
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
                    columns={columns}
                    dataSource={Array.isArray(eventsData?.data) ? eventsData.data : []}
                    rowKey="_id"
                    loading={isLoading || isFetching}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                       
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: "max-content" }}
                />
            </ConfigProvider>

            {/* Delete Modal */}
            <Modal
                open={isModalOpen}
                centered
                onCancel={handleCancel}
                footer={null}
            >
                <div className="flex flex-col justify-center items-center py-10">
                    <h1 className="text-3xl text-center text-[#00c0b5]">Are you sure!</h1>
                    <p className="text-xl text-center mt-5">
                        Do you want to delete this event?
                    </p>
                    <div className="text-center py-5 w-full flex justify-end gap-5">
                        <button
                            onClick={handleCancel}
                            className="bg-red-500 text-white font-semibold w-1/2 py-3 px-5 rounded-lg"
                        >
                            CONFIRM
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-[#00c0b5] text-white font-semibold w-1/2 py-3 px-5 rounded-lg"
                        >
                            CANCEL
                        </button>
                    </div>
                </div>
            </Modal>

            {/* View Event Modal */}
{/* View Event Modal */}
<Modal
    open={isViewModalOpen}
    title={null}
    centered
    onCancel={handleViewCancel}
    footer={null}
    width={800}
    className="event-view-modal"
>
    {selectedEvent && (
        <div className="relative">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-[#00c0b5] to-[#00a89b] p-6 -m-6 mb-6 rounded-t-lg">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <img
                            src={getImageUrl(selectedEvent.photo)}
                            alt={selectedEvent.event_title}
                            className="w-32 h-24 rounded-lg border-4 border-white shadow-lg object-cover"
                        />
                    </div>
                    <div className="text-white">
                        <h2 className="text-2xl font-bold mb-2">{selectedEvent.event_title}</h2>
                        <p className="text-white/90">Hosted by {selectedEvent.hostId?.name || 'N/A'}</p>
                    </div>
                </div>
            </div>

            {/* Content sections */}
            <div className="space-y-6">
                {/* Event Information */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#00c0b5] rounded-full"></div>
                        Event Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-600 text-lg">📅</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-600">Date</h4>
                                    <p className="text-lg font-semibold text-gray-800">{selectedEvent.date}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <span className="text-purple-600 text-lg">⏰</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-600">Time</h4>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {selectedEvent.starting_time} - {selectedEvent.ending_time}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event Details */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#00c0b5] rounded-full"></div>
                        Event Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <span className="text-green-600 text-lg">🏷️</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-600">Category</h4>
                                    <p className="text-lg font-semibold text-gray-800 capitalize">
                                        {selectedEvent.event_category}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <span className="text-yellow-600 text-lg">👥</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-600">Capacity</h4>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {selectedEvent.audience_settings?.max_capacity || 'N/A'} people
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                {selectedEvent.audience_settings?.price > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#00c0b5] rounded-full"></div>
                            Pricing
                        </h3>
                        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow w-full md:w-1/2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-600 text-lg">💰</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-600">Ticket Price</h4>
                                    <p className="text-lg font-semibold text-gray-800">
                                        ${selectedEvent.audience_settings.price}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200">
                <button
                    onClick={handleViewCancel}
                    className="bg-[#00c0b5] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#00a89b] transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    )}
</Modal>
        </div>
    );
}

export default EventManagement;