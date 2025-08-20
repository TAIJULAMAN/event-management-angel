import { ConfigProvider, Modal, Table } from "antd";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import PageHeading from "../../components/PageHeading/PageHeading";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";

function EventManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showViewModal = (user) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };
    const handleViewCancel = () => {
        setIsViewModalOpen(false);
        setSelectedUser(null);
    };
    const dataSource = [
        {
            key: "1",
            no: "1",
            name: "John Doe",
            image: "",
            owner: "Jane Cooper",
            type: "upcoming",
            category: "johndoe@example.com",
            location: "New York, USA",
        },
    ];
    const columns = [
        {
            title: "No",
            dataIndex: "no",
            key: "no",
        },
        {
            title: "Name",
            key: "name",
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <img
                        src={`https://avatar.iran.liara.run/public/${record.key}`}
                        className="w-10 h-10 object-cover rounded-full"
                        alt="User Avatar"
                    />
                    <div className="flex flex-col gap-[2px]">
                        <span className="leading-none">{record.name}</span>
                        {/* <span className="leading-none text-gray-500 text-sm">{record.email}</span> */}
                    </div>
                </div>
            ),
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
        },
        {
            title: "Phone Number",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Location",
            dataIndex: "location",
            key: "location",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div className="flex gap-2">
                    <button className="" onClick={() => showViewModal(record)}>
                        <FaRegEye className="text-[#00c0b5] w-10 h-10 cursor-pointer rounded-md" />
                    </button>
                    <button className="" onClick={showModal}>
                        <RiDeleteBin6Line className="text-red-400 w-10 h-10 cursor-pointer rounded-md" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="my-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <PageHeading title="Event Management" />
                <div className="relative w-full sm:w-[300px] ">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border border-[#e5eaf2] py-3 pl-12 pr-[65px] outline-none w-full rounded-md"
                    />
                    <span className=" text-gray-500 absolute top-0 left-0 h-full px-5 flex items-center justify-center rounded-r-md cursor-pointer">
                        <IoSearch className="text-[1.3rem]" />
                    </span>
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
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: "max-content" }}
                />
                {/* Delete Modal */}
                <Modal
                    open={isModalOpen}
                    centered
                    onCancel={handleCancel}
                    footer={null}
                >
                    <div className="flex flex-col justify-center items-center py-10">
                        <h1 className="text-3xl text-center text-[#00c0b5]">
                            Are you sure!
                        </h1>
                        <p className="text-xl text-center mt-5">
                            Do you want to delete this user profile?
                        </p>
                        <div className="text-center py-5 w-full">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-[#00c0b5] text-white font-semibold w-1/3 py-3 px-5 rounded-lg"
                            >
                                CONFIRM
                            </button>
                        </div>
                    </div>
                </Modal>

                {/* View Modal */}
                <Modal
                    open={isViewModalOpen}
                    centered
                    onCancel={handleViewCancel}
                    footer={null}
                    width={800}
                    className="user-view-modal"
                >
                    {selectedUser && (
                        <div className="relative">
                            {/* Header with gradient background */}
                            <div className="bg-gradient-to-r from-[#00c0b5] to-[#00a89b] p-6 -m-6 mb-6 rounded-t-lg">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <img
                                            src={`https://avatar.iran.liara.run/public/${selectedUser.key}`}
                                            alt={selectedUser.name}
                                            className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                                        />
                                    </div>
                                    <div className="text-white">
                                        <h2 className="text-3xl font-bold mb-2">{selectedUser.name}</h2>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                                                {selectedUser.role}
                                            </span>

                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* Content sections */}
                            <div className="space-y-6">
                                {/* Contact Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-[#00c0b5] rounded-full"></div>
                                        Contact Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-blue-600 text-lg">📞</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-600">Phone Number</h4>
                                                    <p className="text-lg font-semibold text-gray-800">{selectedUser.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-purple-600 text-lg">📧</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-600">Email Address</h4>
                                                    <p className="text-lg font-semibold text-gray-800">{selectedUser.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Location & Additional Info */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-[#00c0b5] rounded-full"></div>
                                        Location & Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-green-600 text-lg">📍</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-600">Location</h4>
                                                    <p className="text-lg font-semibold text-gray-800">{selectedUser.location}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-orange-600 text-lg">⏰</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-600">Member Since</h4>
                                                    <p className="text-lg font-semibold text-gray-800">January 2024</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Activity Stats */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-[#00c0b5] rounded-full"></div>
                                        Activity Overview
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
                                            <div className="text-2xl font-bold text-blue-600 mb-1">24</div>
                                            <div className="text-sm text-blue-700">Events Attended</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
                                            <div className="text-2xl font-bold text-green-600 mb-1">12</div>
                                            <div className="text-sm text-green-700">Events Hosted</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
                                            <div className="text-2xl font-bold text-purple-600 mb-1">4.8</div>
                                            <div className="text-sm text-purple-700">Rating</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200">

                                <button
                                    onClick={handleViewCancel}
                                    className="bg-gray-500 text-white font-semibold px-8 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>
            </ConfigProvider>
        </div>
    );
}

export default EventManagement;
