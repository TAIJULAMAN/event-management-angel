import { ConfigProvider, Modal, Table } from "antd";
import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import PageHeading from "../../components/PageHeading/PageHeading";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { useGetAllEventGroupQuery } from "../../redux/api/allEventGroups";
import { getImageUrl } from "../../config/envConfig";

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

  const { data: eventsData, isLoading, isFetching } = useGetAllEventGroupQuery({
    searchTerm,
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
      <Modal
        open={isViewModalOpen}
        title="Event Group Details"
        centered
        onCancel={handleViewCancel}
        footer={null}
        width={700}
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <img
                src={getImageUrl(selectedEvent.eventId?.photo)}
                alt="Event"
                className="w-40 h-32 object-cover rounded"
              />
              <div>
                <h3 className="text-xl font-semibold">{selectedEvent.eventId?.event_title}</h3>
                <p className="text-gray-600">Group: {selectedEvent.groupName}</p>
                <p className="text-gray-600">Date: {selectedEvent.eventId?.date}</p>
                <p className="text-gray-600">
                  Time: {selectedEvent.eventId?.starting_time} - {selectedEvent.eventId?.ending_time}
                </p>
                <p className="text-gray-600">
                  Host: {selectedEvent.eventId?.hostId?.name || 'N/A'}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold">Event Details</h4>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-gray-600">Category:</p>
                  <p>{selectedEvent.eventId?.event_category}</p>
                </div>
                <div>
                  <p className="text-gray-600">Max Capacity:</p>
                  <p>{selectedEvent.eventId?.audience_settings?.max_capacity || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Members:</p>
                  <p>{selectedEvent.totalMember}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default MediaSocial;