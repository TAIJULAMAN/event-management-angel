import { ConfigProvider, Modal, Table } from "antd";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import PageHeading from "../../components/PageHeading/PageHeading";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { BiMessage } from "react-icons/bi";
import { LuMessageSquareText } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

function Reports() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

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
      reason: "The content is irrelevant.",
      reportedFrom: "Event page",
      type: "Spam/Scam",
    },
    {
      key: "2",
      no: "2",
      name: "Jane Smith",
      reason: "Contains inappropriate language.",
      reportedFrom: "User profile",
      type: "Abusive Content",
    },
    {
      key: "3",
      no: "3",
      name: "Robert Brown",
      reason: "Misleading information provided.",
      reportedFrom: "Dashboard",
      type: "Fake Information",
    },
    {
      key: "4",
      no: "4",
      name: "Emily Johnson",
      reason: "Harassment in the comments section.",
      reportedFrom: "Comment section",
      type: "Harassment",
    },
    {
      key: "5",
      no: "5",
      name: "Michael Wilson",
      reason: "Repeated posting of promotional links.",
      reportedFrom: "Forum",
      type: "Spam/Scam",
    },
    {
      key: "6",
      no: "6",
      name: "Sophia Taylor",
      reason: "Impersonating another user.",
      reportedFrom: "User profile",
      type: "Identity Theft",
    },
    {
      key: "7",
      no: "7",
      name: "William Anderson",
      reason: "Posting explicit images.",
      reportedFrom: "Gallery",
      type: "Adult Content",
    },
    {
      key: "8",
      no: "8",
      name: "Olivia Thomas",
      reason: "Promoting harmful activities.",
      reportedFrom: "Blog page",
      type: "Harmful Content",
    },
    {
      key: "9",
      no: "9",
      name: "James Martinez",
      reason: "Spreading political misinformation.",
      reportedFrom: "News feed",
      type: "Fake Information",
    },
    {
      key: "10",
      no: "10",
      name: "Ava White",
      reason: "Threatening another user.",
      reportedFrom: "Direct messages",
      type: "Harassment",
    },
    {
      key: "11",
      no: "11",
      name: "Ethan Harris",
      reason: "Using offensive slurs repeatedly.",
      reportedFrom: "Group chat",
      type: "Abusive Content",
    },
    {
      key: "12",
      no: "12",
      name: "Charlotte Clark",
      reason: "Excessive self-promotion.",
      reportedFrom: "Forum",
      type: "Spam/Scam",
    },
    {
      key: "13",
      no: "13",
      name: "Benjamin Lewis",
      reason: "Distributing pirated materials.",
      reportedFrom: "Download section",
      type: "Illegal Content",
    },
    {
      key: "14",
      no: "14",
      name: "Amelia Walker",
      reason: "Promoting unverified medical advice.",
      reportedFrom: "Article page",
      type: "Misinformation",
    },
    {
      key: "15",
      no: "15",
      name: "Lucas Hall",
      reason: "Repeatedly creating fake events.",
      reportedFrom: "Event page",
      type: "Fake Information",
    },
    {
      key: "16",
      no: "16",
      name: "Mia Allen",
      reason: "Sending phishing links.",
      reportedFrom: "Direct messages",
      type: "Spam/Scam",
    },
    {
      key: "17",
      no: "17",
      name: "Henry Young",
      reason: "Promoting extremist content.",
      reportedFrom: "News section",
      type: "Harmful Content",
    },
    {
      key: "18",
      no: "18",
      name: "Harper King",
      reason: "Sharing disturbing violent images.",
      reportedFrom: "Gallery",
      type: "Violence",
    },
    {
      key: "19",
      no: "19",
      name: "Alexander Scott",
      reason: "Abusive language towards moderators.",
      reportedFrom: "Support chat",
      type: "Abusive Content",
    },
    {
      key: "20",
      no: "20",
      name: "Ella Green",
      reason: "Repeatedly posting irrelevant comments.",
      reportedFrom: "Comment section",
      type: "Spam/Scam",
    },
    {
      key: "21",
      no: "21",
      name: "Daniel Baker",
      reason: "Impersonating an official account.",
      reportedFrom: "User profile",
      type: "Identity Theft",
    },
    {
      key: "22",
      no: "22",
      name: "Scarlett Adams",
      reason: "Promoting pyramid schemes.",
      reportedFrom: "Forum",
      type: "Scam",
    },
    {
      key: "23",
      no: "23",
      name: "Matthew Campbell",
      reason: "Posting misleading discount offers.",
      reportedFrom: "Product page",
      type: "Fake Information",
    },
    {
      key: "24",
      no: "24",
      name: "Victoria Roberts",
      reason: "Spamming cryptocurrency promotions.",
      reportedFrom: "Dashboard",
      type: "Spam/Scam",
    },
    {
      key: "25",
      no: "25",
      name: "Joseph Phillips",
      reason: "Uploading inappropriate memes.",
      reportedFrom: "Gallery",
      type: "Adult Content",
    },
    {
      key: "26",
      no: "26",
      name: "Grace Parker",
      reason: "Promoting fake giveaways.",
      reportedFrom: "Event page",
      type: "Scam",
    },
    {
      key: "27",
      no: "27",
      name: "Samuel Evans",
      reason: "Repeated trolling behavior.",
      reportedFrom: "Group chat",
      type: "Harassment",
    },
    {
      key: "28",
      no: "28",
      name: "Chloe Turner",
      reason: "Sharing private information publicly.",
      reportedFrom: "User profile",
      type: "Privacy Violation",
    },
    {
      key: "29",
      no: "29",
      name: "David Carter",
      reason: "Posting dangerous challenges.",
      reportedFrom: "Video section",
      type: "Harmful Content",
    },
    {
      key: "30",
      no: "30",
      name: "Lily Mitchell",
      reason: "Spreading conspiracy theories.",
      reportedFrom: "News section",
      type: "Misinformation",
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

          </div>
        </div>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Reported Form",
      dataIndex: "reportedFrom",
      key: "reportedFrom",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <button className="" onClick={() => navigate("/chat")}>
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
          className="report-view-modal"
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
                    <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold text-white bg-red-500">
                      REPORT
                    </div>
                  </div>
                  <div className="text-white">
                    <h2 className="text-3xl font-bold mb-2">
                      Report #{selectedUser.no.padStart(4, '0')}
                    </h2>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        Reported User: {selectedUser.name}
                      </span>
                    </div>
                    <p className="text-white/90">Status: Under Review</p>
                  </div>
                </div>
              </div>

              {/* Content sections */}
              <div className="space-y-6">
                {/* Report Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#00c0b5] rounded-full"></div>
                    Report Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <span className="text-red-600 text-lg">⚠️</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-600">
                            Reason
                          </h4>
                          <p className="text-lg font-semibold text-gray-800">
                            {selectedUser.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-orange-600 text-lg">📋</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-600">
                            Report Type
                          </h4>
                          <p className="text-lg font-semibold text-gray-800">
                            {selectedUser.type}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reporter & Additional Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#00c0b5] rounded-full"></div>
                    Reporter Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 text-lg">👤</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-600">
                            Reported From
                          </h4>
                          <p className="text-lg font-semibold text-gray-800">
                            {selectedUser.reportedFrom}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 text-lg">📅</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-600">
                            Report Date
                          </h4>
                          <p className="text-lg font-semibold text-gray-800">
                            {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Report Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#00c0b5] rounded-full"></div>
                    Report Description
                  </h3>
                  <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                    <p className="text-gray-700 leading-relaxed">
                      <strong>Report Details:</strong> {selectedUser.reason}
                      <br /><br />
                      <strong>Location:</strong> This incident was reported from the {selectedUser.reportedFrom}.
                      <br /><br />
                      <strong>Category:</strong> This report has been classified as "{selectedUser.type}".
                      Further investigation is required to determine the appropriate action.
                    </p>
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
