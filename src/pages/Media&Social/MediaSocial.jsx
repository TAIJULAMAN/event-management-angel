import { ConfigProvider, Modal, Table } from "antd";
import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import PageHeading from "../../components/PageHeading/PageHeading";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { useGetAllEventGroupQuery } from "../../redux/api/allEventGroups";
import { getImageUrl } from "../../config/envConfig";
import useDebounce from "../../hooks/useDebounce";

function MediaSocial() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const { data: eventsData, isLoading, isFetching } = useGetAllEventGroupQuery({
    searchTerm: debouncedSearchTerm,
    page: pagination.current,
    limit: pagination.pageSize,
  });

  useEffect(() => {
    if (eventsData?.data?.meta) {
      setPagination(prev => ({
        ...prev,
        total: eventsData.data.meta.total || 0,
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
      title: "Event Image",
      key: "image",
      render: (_, record) => (
        <img
          src={getImageUrl(record.eventId?.photo)}
          className="w-20 h-10 object-cover"
          alt="Event"
        />
      ),
    },
    {
      title: "Event Title",
      dataIndex: ["eventId", "event_title"],
      key: "event_title",
    },
    {
      title: "Group Name",
      dataIndex: "groupName",
      key: "groupName",
    },
    {
      title: "Total Members",
      dataIndex: "totalMember",
      key: "totalMember",
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
        <PageHeading title="All Event Groups" />
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
          dataSource={eventsData?.data?.all_my_join_event || []}
          rowKey="_id"
          loading={isLoading || isFetching}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: false,
            pageSizeOptions: ['10', '20', '50', '100'],
           
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
            Do you want to delete this event group?
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

      {/* View Event Group Modal */}
{/* View Event Group Modal */}
<Modal
  open={isViewModalOpen}
  title={null}
  centered
  onCancel={handleViewCancel}
  footer={null}
  width={800}
  className="event-details-modal"
>
  {selectedEvent && (
    <div className="relative">
      {/* Header with gradient background and event image */}
      <div className="relative h-64 w-full overflow-hidden rounded-t-lg mt-10">
        <img
          src={getImageUrl(selectedEvent.eventId?.photo)}
          alt="Event"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h2 className="text-3xl font-bold mb-2">{selectedEvent.eventId?.event_title}</h2>
          <p className="text-lg opacity-90">Hosted by {selectedEvent.eventId?.hostId?.name || 'N/A'}</p>
        </div>
      </div>

      <div className="p-6">
        {/* Event Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-600 text-xl">📅</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{selectedEvent.eventId?.date}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <span className="text-purple-600 text-xl">⏰</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">
                  {selectedEvent.eventId?.starting_time} - {selectedEvent.eventId?.ending_time}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <span className="text-green-600 text-xl">👥</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Group Members</p>
                <p className="font-medium">{selectedEvent.totalMember} members</p>
              </div>
            </div>
          </div>
        </div>

        {/* Group and Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00c0b5] rounded-full"></div>
              Group Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Group Name</p>
                <p className="font-medium">{selectedEvent.groupName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Group Members</p>
                <p className="font-medium">{selectedEvent.totalMember} members</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Group Status</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00c0b5] rounded-full"></div>
              Event Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Category</p>
                <p className="font-medium capitalize">{selectedEvent.eventId?.event_category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Venue Capacity</p>
                <p className="font-medium">
                  {selectedEvent.eventId?.audience_settings?.max_capacity || 'N/A'} people
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Event Host</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">
                      {selectedEvent.eventId?.hostId?.name?.charAt(0) || 'H'}
                    </span>
                  </div>
                  <span className="font-medium">{selectedEvent.eventId?.hostId?.name || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={handleViewCancel}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Close
          </button>
       
        </div>
      </div>
    </div>
  )}
</Modal>
    </div>
  );
}

export default MediaSocial;