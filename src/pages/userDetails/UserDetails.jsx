import { ConfigProvider, Modal, Table, Spin, Alert } from "antd";
import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import PageHeading from "../../components/PageHeading/PageHeading";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { useGetAllUserQuery, useChangeStatusMutation } from "../../redux/api/userApi";
import { format } from 'date-fns';
import { FiMail, FiPhone, FiCalendar, FiUser } from 'react-icons/fi';
import { getImageUrl } from "../../config/envConfig";
import useDebounce from "../../hooks/useDebounce";
import defaultIMG from "../../assets/defaultImg";

function UserDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusConfirmLoading, setStatusConfirmLoading] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const compute = () => setIsMobile(window.innerWidth < 768);
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  const { data, isLoading, isError, error } = useGetAllUserQuery({
    page: pagination.current,
    limit: pagination.pageSize,
    searchTerm: debouncedSearchTerm || undefined,
  });
  const [changeStatus, { isLoading: isChangingStatus }] = useChangeStatusMutation();

  useEffect(() => {
    if (data?.data?.meta) {
      setPagination(prev => ({
        ...prev,
        total: data.data.meta.total,
      }));
    }
  }, [data]);

  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set a new timeout
    setSearchTimeout(
      setTimeout(() => {
        setPagination(prev => ({
          ...prev,
          current: 1, // Reset to first page on new search
        }));
      }, 500)
    );
  };

  // Format the user data for the table
  const dataSource = data?.data?.all_users?.map((user, index) => ({
    key: user._id,
    no: (pagination.current - 1) * pagination.pageSize + index + 1,
    name: user.name || 'N/A',
    photo: user.photo || `${defaultIMG}`,
    role: 'User', // Default role since it's not in the API response
    phone: user.phoneNumber || 'N/A',
    email: user.email || 'N/A',
    location: 'N/A', // Not in the API response
    createdAt: user.createdAt,
    status: user.status,
  })) || [];

  console.log(dataSource);

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 70,
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            src={`${getImageUrl(record?.photo)}`}
            className="w-10 h-10 object-cover rounded-full"
            alt="User Avatar"
          />
          <div className="flex flex-col gap-[2px]">
            <span className="leading-none">{record.name}</span>
            <span className="leading-none text-gray-500 text-sm">{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Join Date",
      key: "joinDate",
      render: (_, record) => (
        <span>
          {record.createdAt ? format(new Date(record.createdAt), 'MMM dd, yyyy') : 'N/A'}
        </span>
      ),
      width: 150,
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      render: (_, record) => {
        const isBlocked = record.status === 'blocked';
        const color = isBlocked ? 'red' : 'green';
        const text = isBlocked ? 'Blocked' : 'Active';
        return (
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: `${color}20`, color }}
          >
            <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: color }} />
            {text}
          </span>
        );
      },
    },
    {
      title: "Change Status",
      key: "changeStatus",
      width: 160,
      render: (_, record) => (
        <button
          onClick={() => {
            const next = record.status === 'blocked' ? 'isProgress' : 'blocked';
            setPendingStatusChange({ id: record.key, next, name: record.name });
            setIsStatusModalOpen(true);
          }}
          disabled={isChangingStatus}
          className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${
            record.status === 'blocked'
              ? 'text-green-600 border-green-200 hover:bg-green-50'
              : 'text-red-600 border-red-200 hover:bg-red-50'
          }`}
          title={record.status === 'blocked' ? 'Set Active' : 'Block User'}
        >
          {record.status === 'blocked' ? 'Set Active' : 'Block'}
        </button>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: isMobile ? undefined : 'right',
      width: 140,
      render: (_, record) => (
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => showViewModal(record)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="View Details"
          >
            <FaRegEye className="text-[#00c0b5] w-5 h-5" />
          </button>
          <button 
            onClick={() => {
              setSelectedUser(record);
              setIsModalOpen(true);
            }}
            className="p-2 hover:bg-red-50 rounded-full transition-colors"
            title="Delete User"
          >
            <RiDeleteBin6Line className="text-red-400 w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];


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

  if (isLoading && !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert
          message="Error"
          description={error?.data?.message || 'Failed to load users. Please try again later.'}
          type="error"
          showIcon
          className="mb-6"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="my-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <PageHeading title="User Management" />
        <div className="relative w-full sm:w-[300px]">
          <input
            type="text"
            placeholder="Search..."
            className="border border-[#e5eaf2] py-3 pl-12 pr-[65px] outline-none w-full rounded-md"
            onChange={handleSearch}
            value={searchTerm}
          />
          <span className="text-gray-500 absolute top-0 left-0 h-full px-5 flex items-center justify-center rounded-r-md">
            <IoSearch className="text-[1.3rem]" />
          </span>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm">

        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: "#00c0b5",
                headerColor: "rgb(255,255,255)",
                cellFontSize: 16,
                headerSplitColor: "#00c0b5",
                rowHoverBg: "rgba(0, 192, 181, 0.05)",
              },
            },
          }}
        >
          <Table
            dataSource={dataSource}
            columns={columns}
            loading={isLoading}
            pagination={{
              ...pagination,
            }}
            onChange={handleTableChange}
            scroll={{ x: 1000 }}
            className="w-full"
          />
        </ConfigProvider>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete User"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <div className="flex flex-col items-center py-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Are you sure?
          </h3>
          <p className="text-gray-600 mb-6 text-center">
            This action cannot be undone. This will permanently delete the user account.
          </p>
          <div className="flex gap-4 w-full justify-center">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // TODO: Implement delete functionality
                console.log('Delete user:', selectedUser?.key);
                setIsModalOpen(false);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Change Status Confirmation Modal */}
      <Modal
        title="Confirm Status Change"
        open={isStatusModalOpen}
        confirmLoading={statusConfirmLoading}
        onOk={async () => {
          if (!pendingStatusChange) return;
          try {
            setStatusConfirmLoading(true);
            await changeStatus({ id: pendingStatusChange.id, status: pendingStatusChange.next }).unwrap();
            setIsStatusModalOpen(false);
            setPendingStatusChange(null);
          } catch (err) {
            // Handle error
            console.error('Failed to change status:', err);
          } finally {
            setStatusConfirmLoading(false);
          }
        }}
        onCancel={() => {
          setIsStatusModalOpen(false);
          setPendingStatusChange(null);
        }}
        centered
      >
        <p>
          Are you sure you want to set
          <span className="font-semibold"> {pendingStatusChange?.name} </span>
          to
          <span className="font-semibold"> {pendingStatusChange?.next === 'blocked' ? 'Blocked' : 'Active'} </span>
          ?
        </p>
      </Modal>

      {/* View User Details Modal */}
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
                    src={getImageUrl(selectedUser.photo) || `${defaultIMG}`}
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
                        <FiPhone className="text-blue-600 text-lg" />
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
                        <FiMail className="text-purple-600 text-lg" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-600">Email Address</h4>
                        <p className="text-lg font-semibold text-gray-800">{selectedUser.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00c0b5] rounded-full"></div>
                  Account Information
                </h3>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FiUser className="text-green-600 text-lg" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-600">User Role</h4>
                        <p className="text-base font-medium text-gray-800">{selectedUser.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FiCalendar className="text-yellow-600 text-lg" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-600">Join Date</h4>
                        <p className="text-base font-medium text-gray-800">
                          {selectedUser.createdAt ? format(new Date(selectedUser.createdAt), 'MMMM d, yyyy') : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              {/* <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00c0b5] rounded-full"></div>
                  Location Information
                </h3>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiMapPin className="text-indigo-600 text-lg" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-600">Location</h4>
                      <p className="text-base font-medium text-gray-800">
                        {selectedUser.location || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Action buttons */}
              <div className="flex justify-end items-center pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={handleViewCancel}
                  className="bg-[#00c0b5] text-white font-semibold px-8 py-2 rounded-lg hover:bg-[#00a89b] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    <ConfigProvider> </ConfigProvider>
  </div>
  );
};

export default UserDetails;
