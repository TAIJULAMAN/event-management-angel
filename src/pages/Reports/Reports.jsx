import { ConfigProvider, Modal, Table } from "antd";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import PageHeading from "../../components/PageHeading/PageHeading";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { BiMessage } from "react-icons/bi";
import { LuMessageSquareText } from "react-icons/lu";

function Reports() {
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
      role: "Host",
      phone: "+1 9876543210",
      email: "johndoe@example.com",
      location: "New York, USA",
    },
    {
      key: "2",
      no: "2",
      name: "Emma Smith",
      role: "Driver",
      phone: "+1 9876543211",
      email: "emmasmith@example.com",
      location: "Los Angeles, USA",
    },
    {
      key: "3",
      no: "3",
      name: "Liam Johnson",
      role: "Manager",
      phone: "+1 9876543212",
      email: "liamjohnson@example.com",
      location: "Chicago, USA",
    },
    {
      key: "4",
      no: "4",
      name: "Olivia Brown",
      role: "Supervisor",
      phone: "+1 9876543213",
      email: "oliviabrown@example.com",
      location: "Houston, USA",
    },
    {
      key: "5",
      no: "5",
      name: "Noah Davis",
      role: "Host",
      phone: "+1 9876543214",
      email: "noahdavis@example.com",
      location: "Phoenix, USA",
    },
    {
      key: "6",
      no: "6",
      name: "Sophia Miller",
      role: "Driver",
      phone: "+1 9876543215",
      email: "sophiamiller@example.com",
      location: "Philadelphia, USA",
    },
    {
      key: "7",
      no: "7",
      name: "James Wilson",
      role: "Manager",
      phone: "+1 9876543216",
      email: "jameswilson@example.com",
      location: "San Antonio, USA",
    },
    {
      key: "8",
      no: "8",
      name: "Isabella Moore",
      role: "Supervisor",
      phone: "+1 9876543217",
      email: "isabellamoore@example.com",
      location: "San Diego, USA",
    },
    {
      key: "9",
      no: "9",
      name: "Benjamin Taylor",
      role: "Host",
      phone: "+1 9876543218",
      email: "benjamintaylor@example.com",
      location: "Dallas, USA",
    },
    {
      key: "10",
      no: "10",
      name: "Mia Anderson",
      role: "Driver",
      phone: "+1 9876543219",
      email: "miaanderson@example.com",
      location: "San Jose, USA",
    },
    {
      key: "11",
      no: "11",
      name: "Elijah Thomas",
      role: "Manager",
      phone: "+1 9876543220",
      email: "elijahthomas@example.com",
      location: "Austin, USA",
    },
    {
      key: "12",
      no: "12",
      name: "Charlotte Jackson",
      role: "Supervisor",
      phone: "+1 9876543221",
      email: "charlottejackson@example.com",
      location: "Jacksonville, USA",
    },
    {
      key: "13",
      no: "13",
      name: "William White",
      role: "Host",
      phone: "+1 9876543222",
      email: "williamwhite@example.com",
      location: "Fort Worth, USA",
    },
    {
      key: "14",
      no: "14",
      name: "Amelia Harris",
      role: "Driver",
      phone: "+1 9876543223",
      email: "ameliaharris@example.com",
      location: "Columbus, USA",
    },
    {
      key: "15",
      no: "15",
      name: "Henry Martin",
      role: "Manager",
      phone: "+1 9876543224",
      email: "henrymartin@example.com",
      location: "Charlotte, USA",
    },
    {
      key: "16",
      no: "16",
      name: "Evelyn Thompson",
      role: "Supervisor",
      phone: "+1 9876543225",
      email: "evelynthompson@example.com",
      location: "San Francisco, USA",
    },
    {
      key: "17",
      no: "17",
      name: "Alexander Garcia",
      role: "Host",
      phone: "+1 9876543226",
      email: "alexandergarcia@example.com",
      location: "Indianapolis, USA",
    },
    {
      key: "18",
      no: "18",
      name: "Harper Martinez",
      role: "Driver",
      phone: "+1 9876543227",
      email: "harpermartinez@example.com",
      location: "Seattle, USA",
    },
    {
      key: "19",
      no: "19",
      name: "Daniel Robinson",
      role: "Manager",
      phone: "+1 9876543228",
      email: "danielrobinson@example.com",
      location: "Denver, USA",
    },
    {
      key: "20",
      no: "20",
      name: "Ella Clark",
      role: "Supervisor",
      phone: "+1 9876543229",
      email: "ellaclark@example.com",
      location: "Washington, USA",
    },
    {
      key: "21",
      no: "21",
      name: "Matthew Rodriguez",
      role: "Host",
      phone: "+1 9876543230",
      email: "matthewrodriguez@example.com",
      location: "Boston, USA",
    },
    {
      key: "22",
      no: "22",
      name: "Scarlett Lewis",
      role: "Driver",
      phone: "+1 9876543231",
      email: "scarlettlewis@example.com",
      location: "El Paso, USA",
    },
    {
      key: "23",
      no: "23",
      name: "Jackson Lee",
      role: "Manager",
      phone: "+1 9876543232",
      email: "jacksonlee@example.com",
      location: "Nashville, USA",
    },
    {
      key: "24",
      no: "24",
      name: "Victoria Walker",
      role: "Supervisor",
      phone: "+1 9876543233",
      email: "victoriawalker@example.com",
      location: "Detroit, USA",
    },
    {
      key: "25",
      no: "25",
      name: "Sebastian Hall",
      role: "Host",
      phone: "+1 9876543234",
      email: "sebastianhall@example.com",
      location: "Oklahoma City, USA",
    },
    {
      key: "26",
      no: "26",
      name: "Aria Allen",
      role: "Driver",
      phone: "+1 9876543235",
      email: "ariaallen@example.com",
      location: "Las Vegas, USA",
    },
    {
      key: "27",
      no: "27",
      name: "David Young",
      role: "Manager",
      phone: "+1 9876543236",
      email: "davideyoung@example.com",
      location: "Portland, USA",
    },
    {
      key: "28",
      no: "28",
      name: "Grace King",
      role: "Supervisor",
      phone: "+1 9876543237",
      email: "graceking@example.com",
      location: "Memphis, USA",
    },
    {
      key: "29",
      no: "29",
      name: "Joseph Scott",
      role: "Host",
      phone: "+1 9876543238",
      email: "josephscott@example.com",
      location: "Louisville, USA",
    },
    {
      key: "30",
      no: "30",
      name: "Chloe Green",
      role: "Driver",
      phone: "+1 9876543239",
      email: "chloegreen@example.com",
      location: "Baltimore, USA",
    },
  ];
  const columns = [
    {
      title: "Sr.No",
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
      title: "Reason",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Reported Form",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Type",
      dataIndex: "email",
      key: "email",
    },
    // {
    //   title: "Action",
    //   dataIndex: "location",
    //   key: "location",
    // },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <button className="" onClick={showModal}>
            <LuMessageSquareText className=" w-10 h-10 cursor-pointer rounded-md" />
          </button>

          <button className="" onClick={() => showViewModal(record)}>
            <FaRegEye className="text-[#00c0b5] w-10 h-10 cursor-pointer rounded-md" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="my-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <PageHeading title="Reports" />
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
                    <h2 className="text-3xl font-bold mb-2">
                      {selectedUser.name}
                    </h2>
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
                          <h4 className="text-sm font-medium text-gray-600">
                            Phone Number
                          </h4>
                          <p className="text-lg font-semibold text-gray-800">
                            {selectedUser.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-purple-600 text-lg">📧</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-600">
                            Email Address
                          </h4>
                          <p className="text-lg font-semibold text-gray-800">
                            {selectedUser.email}
                          </p>
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
                          <h4 className="text-sm font-medium text-gray-600">
                            Location
                          </h4>
                          <p className="text-lg font-semibold text-gray-800">
                            {selectedUser.location}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-orange-600 text-lg">⏰</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-600">
                            Member Since
                          </h4>
                          <p className="text-lg font-semibold text-gray-800">
                            January 2024
                          </p>
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
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        24
                      </div>
                      <div className="text-sm text-blue-700">
                        Events Attended
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        12
                      </div>
                      <div className="text-sm text-green-700">
                        Events Hosted
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        4.8
                      </div>
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

export default Reports;
