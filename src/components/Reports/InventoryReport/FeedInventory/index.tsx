import EditFeedInventoryModal from "@/components/Common/Modal/EditFeedInventory";
import { DataTable } from "@/components/Common/Table";
import useGetAllFeedInventory from "@/hooks/FeedInventory/useGetAllFeedInventories";
import dayjs from "dayjs";
import { useState } from "react";

const FeedInventoryReport = () => {
  // const BASE_URL = import.meta.env.VITE_API_URL;
  // const [report, setReport] = useState([]);
  const [editRecord, setEditRecord] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const { data: reports, isPending } = useGetAllFeedInventory();
  // console.log("feeedRepor", reports);
  // useEffect(() => {
  //   const fetchReport = async () => {
  //     const response = await axios.get(`${BASE_URL}/api/feedinventory`);

  //     setReport(response.data.data);
  //     console.log("report", response.data);
  //   };

  //   fetchReport();
  // }, []);

  const handleEdit = (record) => {
    setEditRecord(record);
    setModalOpen(!isModalOpen);
  };

  const columns = [
    {
      key: "date",
      label: "Date",
      render: (value: string) => dayjs(value).format("DD/MM/YYYY"),
    },
    { key: "batchNo", label: "Batch No." },
    { key: "bagsArrivedCount", label: "Feed Bags." },
    { key: "feedName", label: "Feed Name" },
    { key: "driverName", label: "Driver Name" },
    { key: "driverPhoneNumber", label: "Driver Phone No." },
  ];
  // console.log("BirdInven tory", report);

  return (
    <div className="px-0 py-5">
      <DataTable data={reports?.data} columns={columns} onRowClick={handleEdit} />
      {editRecord && (
        <EditFeedInventoryModal
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
                Feed Name
              </th>
              <th className="px-4 py-2 border-b border-blue-200 text-center">
                Driver Name
              </th>
              <th className="px-4 py-2 border-b border-blue-200 text-center">
                Bags Arrived
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
                  {item.feedName}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-gray-700 text-center">
                  {item.driverName}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-gray-700 text-center">
                  {item.numberOfBagsArrived}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default FeedInventoryReport;
