/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const prepareChartData = (data) => {
  if (!data || !Array.isArray(data)) return [];
  
  // Create a map with all months initialized to 0
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: monthNames[i],
    count: 0,
  }));

  // Update the counts from the API data
  data.forEach((item) => {
    const monthIndex = item.month - 1; // Convert to 0-based index
    if (monthIndex >= 0 && monthIndex < 12) {
      monthlyData[monthIndex].count = item.count;
    }
  });

  return monthlyData;
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { month, count } = payload[0].payload;
    return (
      <div className="bg-white shadow-md p-3 rounded-md border text-gray-700 text-sm">
        <p className="font-medium">{month}</p>
        <p className="font-medium">New Users: {count}</p>
      </div>
    );
  }
  return null;
};

const TotalView = ({ data = [] }) => {
  const [chartHeight, setChartHeight] = useState(220);
  
  const chartData = useMemo(() => prepareChartData(data), [data]);
  const maxCount = useMemo(() => Math.max(...chartData.map(item => item.count), 10), [chartData]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 220) {
        setChartHeight(250); // Adjust height for mobile
      } else if (window.innerWidth < 768) {
        setChartHeight(220); // Adjust height for smaller tablets
      } else {
        setChartHeight(220); // Default height for larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call on mount to set the initial height

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280' }}
            domain={[0, maxCount + (maxCount * 0.1)]}
            tickFormatter={(value) => (value === 0 ? '0' : value)}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
          <Bar
            dataKey="count"
            fill="#00c0b5"
            radius={[4, 4, 0, 0]}
            barSize={16}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TotalView;
