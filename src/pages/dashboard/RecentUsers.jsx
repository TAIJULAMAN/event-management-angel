import { ConfigProvider, Table, Spin, Alert } from "antd";
import { useGetAllUserQuery } from "../../redux/api/userApi";
import { format } from 'date-fns';
import { getImageUrl } from "../../config/envConfig";
import defaultIMG from "../../assets/defaultImg";

const RecentUsers = () => {
  const { data, isLoading, isError, error } = useGetAllUserQuery({ page: 1, limit: 5 });

  // Format the user data for the table
  const dataSource = data?.data?.all_users?.map((user, index) => ({
    key: user._id,
    no: index + 1,
    name: user.name || 'N/A',
    role: user.role || 'USER',
    photo: user.photo || `${defaultIMG}`,
    date: user.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy') : 'N/A',
    phone: user.phoneNumber || 'N/A',
        createdAt: user.createdAt,
    status: user.status,
    email: user.email || 'N/A',
    location: 'N/A', // Location data not available in the API response
  })) || [];

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
      const status =record.status === 'blocked' ? 'blocked' : 'isProgress';
      const statusConfig = {
        isProgress: { text: 'Active', color: 'green' },
        blocked: { text: 'Blocked', color: 'red' }
      };
      
      const { text, color } = statusConfig[status] || statusConfig.isProgress;
      
      return (
        <span 
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium"
          style={{ 
            backgroundColor: `${color}20`, // 20% opacity
            color: color
          }}
        >
          <span 
            className="w-2 h-2 rounded-full mr-1.5" 
            style={{ backgroundColor: color }}
          ></span>
          {text}
        </span>
      );
    },
  },
 
  ];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Error"
        description={error?.data?.message || 'Failed to load users. Please try again later.'}
        type="error"
        showIcon
      />
    );
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          InputNumber: {
            activeBorderColor: "#00c0b5",
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
        pagination={false}
        scroll={{ x: "max-content" }}
        loading={isLoading}
      />
    </ConfigProvider>
  );
};

export default RecentUsers;
