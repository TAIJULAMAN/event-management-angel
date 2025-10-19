import { FaChevronDown, FaUsers, FaVideo } from "react-icons/fa";
import { useState } from "react";
import dayjs from "dayjs";
import RecentUsers from "./RecentUsers";
import TotalUser from "./TotalUser";
import TotalView from "./TotalView";
import { 
  useGetDashboardCountQuery, 
  useGetUserGrowthQuery, 
  useGetEventGrowthQuery 
} from "../../redux/api/dashboard";

function DashboardPage() {
  const currentYear = dayjs().year();
  const startYear = 2024;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isUserGrowthOpen, setIsUserGrowthOpen] = useState(false);
  const [isEventGrowthOpen, setIsEventGrowthOpen] = useState(false);
  
  const { data: dashboardData, isLoading, isError } = useGetDashboardCountQuery();
  const { data: userGrowthData } = useGetUserGrowthQuery(selectedYear);
  const { data: eventGrowthData } = useGetEventGrowthQuery(selectedYear);

  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => startYear + index
  );

  const handleSelectYear = (year, setter) => {
    setSelectedYear(year);
    setter(false);
  };

  if (isLoading) return <div className="p-5">Loading dashboard data...</div>;
  if (isError) return <div className="p-5 text-red-500">Error loading dashboard data</div>;

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 mmd:grid-cols-3 lg:grid-cols-4 gap-5">
        {/* Total Host */}
        <div className="flex justify-between items-center p-5 bg-[#F2F2F2]  gap-5 h-[80px] rounded-lg shadow-md">
          <div className="flex gap-3 items-center">
            <p className="rounded-full flex justify-center items-center">
              <FaUsers
                size={20}
                className=" bg-white rounded-full p-2 w-10 h-10 text-[#00c0b5]"
              />
            </p>
            <p className="text-xl font-semibold">Total Host</p>
          </div>
          <p className="text-[#00c0b5] text-2xl font-bold mr-10">{dashboardData?.data?.totalHost || 0}</p>
        </div>
        {/* Total Dmover */}
        <div className="flex justify-between items-center p-5 bg-[#F2F2F2]  gap-5 h-[80px] rounded-lg shadow-md">
          <div className="flex gap-3 items-center">
            <p className="rounded-full flex justify-center items-center">
              <FaUsers
                size={20}
                className=" bg-white rounded-full p-2 w-10 h-10 text-[#00c0b5]"
              />
            </p>
            <p className="text-xl font-semibold">Total Dmover</p>
          </div>
          <p className="text-[#00c0b5] text-2xl font-bold mr-10">{dashboardData?.data?.totalThrillseekers || 0}</p>
        </div>
        {/*  Total Total Event */}
        <div className="flex justify-between items-center p-5 bg-[#F2F2F2] rounded-lg shadow-md gap-5 h-[80px]">
          <div className="flex gap-3 items-center">
            <p className="rounded-full flex justify-center items-center">
              <FaVideo
                size={20}
                className=" bg-white rounded-full p-2 w-10 h-10 text-[#00c0b5]"
              />
            </p>
            <p className="text-xl font-semibold">Total Event</p>
          </div>
          <p className="text-[#00c0b5] text-2xl font-bold mr-10">{dashboardData?.data?.totalEvent || 0}</p>
        </div>
        {/*  Blocked account */}
        <div className="flex justify-between items-center p-5 bg-[#F2F2F2] rounded-lg shadow-md gap-5 h-[80px]">
          <div className="flex gap-3 items-center">
            <p className="rounded-full flex justify-center items-center">
              <FaVideo
                size={20}
                className=" bg-white rounded-full p-2 w-10 h-10 text-[#00c0b5]"
              />
            </p>
            <p className="text-xl font-semibold">Total Blocked Account</p>
          </div>
          <p className="text-[#00c0b5] text-2xl font-bold mr-10">{dashboardData?.data?.totalBlockAccount || 0}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        <div className="w-full p-5 bg-[#F2F2F2] rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row md:justify-between lg:justify-between items-center gap-5 my-5">
            <div>
              <h1 className="text-xl font-semibold">User Growth</h1>
            </div>
            <div className="flex justify-between items-center gap-5 whitespace-nowrap">

              <div className="relative w-full md:w-32">
                {/* Selected Year Display */}
                <button
                  onClick={() => setIsUserGrowthOpen(!isUserGrowthOpen)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md flex justify-between items-center bg-white transition"
                >
                  <span className="text-[#00c0b5]">{selectedYear}</span>
                  <FaChevronDown className="text-[#00c0b5] w-5 h-5 ml-5" />
                </button>

                {/* Dropdown List */}
                {isUserGrowthOpen && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg text-lg">
                    {years.map((year) => (
                      <div
                        key={year}
                        onClick={() => handleSelectYear(year, setIsUserGrowthOpen)}
                        className={`p-2 cursor-pointer hover:bg-gray-100 transition ${year === selectedYear ? "bg-gray-200" : ""}`}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <TotalView data={userGrowthData?.data?.monthlyStats || []} />
        </div>
        <div className="w-full p-5 bg-[#F2F2F2] rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row md:justify-between lg:justify-between items-center gap-5 my-5">
            <div>
              <h1 className="text-xl font-semibold">Event Growth</h1>
            </div>
            <div className="flex justify-between items-center gap-5 whitespace-nowrap">

              <div className="relative w-full md:w-32">
                {/* Selected Year Display */}
                <button
                  onClick={() => setIsEventGrowthOpen(!isEventGrowthOpen)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md flex justify-between items-center bg-white transition"
                >
                  <span className="text-[#00c0b5]">{selectedYear}</span>
                  <FaChevronDown className="text-[#00c0b5] w-5 h-5 ml-5" />
                </button>

                {/* Dropdown List */}
                {isEventGrowthOpen && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg text-lg">
                    {years.map((year) => (
                      <div
                        key={year}
                        onClick={() => handleSelectYear(year, setIsEventGrowthOpen)}
                        className={`p-2 cursor-pointer hover:bg-gray-100 transition ${year === selectedYear ? "bg-gray-200" : ""}`}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <TotalUser data={eventGrowthData?.data?.monthlyStats || []} />
        </div>
      </div>
      <div className="mt-5">
        <h1 className="text-2xl font-bold mb-5">Recent Joined User</h1>
        <RecentUsers />
      </div>
    </div>
  );
}

export default DashboardPage;
