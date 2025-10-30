import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const DailyReport = (data) => {
  const BASE_URL = import.meta.env.VITE_API;
  const [report, setReport] = useState([]);

  useEffect(() => {
    const fetchReport = async () => {
      const response = await axios.get(`${BASE_URL}/api/dailyregister`);

      setReport(response.data);
      console.log("report", response.data);
    };

    fetchReport();
  }, [data]);

  return (
    <div className="px-2 py-5">
      <div className="overflow-x-auto shadow-lg rounded-md">
        <table className="min-w-full border-collapse bg-white text-sm text-left">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white  text-sm tracking-wider">
              <th className="px-4 py-2 border-b border-blue-200 text-center">Date</th>
              <th className="px-4 py-2 border-b border-blue-200 text-center">Age</th>
              <th className="px-4 py-2 border-b border-blue-200 text-center">
                Feed (Bags)
              </th>
              <th className="px-4 py-2 border-b border-blue-200 text-center">
                Mortality
              </th>
            </tr>
          </thead>
          <tbody>
            {report.map((item, index) => (
              <tr
                key={index}
                className={`transition-all duration-300 hover:bg-blue-50 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}>
                <td className="px-4 py-2 border-b border-gray-200 text-gray-700 text-center">
                  {dayjs(item.date).format("DD/MM/YYYY")}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-gray-700 text-center">
                  {item.age}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-gray-700 text-center">
                  {item.dailyFeedConsume}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-gray-700 text-center">
                  {item.dailyMortality}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyReport;
