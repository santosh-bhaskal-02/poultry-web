import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { DataTable } from "@/components/Common/Table";
import EditDailyRecordModal from "@/components/Common/Modal/EditDailyRecord";

const BirdsInventoryReport = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [report, setReport] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      const response = await axios.get(`${BASE_URL}/api/birdsinventory`);

      setReport(response.data);
      console.log("report", response.data);
    };

    fetchReport();
  }, []);

  const handleEdit = (record) => {
    setEditRecord(record);
    setModalOpen(!isOpen);
  };

  const columns = [
    {
      key: "date",
      label: "Date",
      render: (value: string) => dayjs(value).format("DD/MM/YYYY"),
    },
    { key: "id", label: "Batch No." },
    { key: "birdsArrivedCount", label: "Birds Arrived" },
    { key: "housedBirdCount", label: "Birds Housed" },
  ];
  console.log("BirdInven tory", report);

  return (
    <div className="px-2 py-5">
      <DataTable data={report} columns={columns} onRowClick={handleEdit} />
      {editRecord && (
        <EditDailyRecordModal
          editData={editRecord}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(!isModalOpen)}
        />
      )}

      {/* <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="min-w-full border-collapse bg-white text-sm text-left">
          <thead>
            <tr className="bg-gradient-to-r from-blue-400 to-blue-600 text-white  text-sm tracking-wider">
              <th className="px-4 py-2 border-b border-blue-200 text-center">
                Batch No.
              </th>
              <th className="px-4 py-2 border-b border-blue-200 text-center">Date</th>
              <th className="px-4 py-2 border-b border-blue-200 text-center">
                Birds Arrived
              </th>
              <th className="px-4 py-2 border-b border-blue-200 text-center">
                Birds Housed
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
                  {item.id}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-gray-700 text-center">
                  {dayjs(item.date).format("DD/MM/YYYY")}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-gray-700 text-center">
                  {item.numberOfBirdsArrived}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-gray-700 text-center">
                  {item.numberOfBirdsHoused}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default BirdsInventoryReport;
