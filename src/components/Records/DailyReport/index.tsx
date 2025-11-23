import { useState } from "react";
import dayjs from "dayjs";
import EditDailyRecordModal from "../../Common/Modal/EditDailyRecord";
import { DataTable } from "@/components/Common/Table";
import useGetAllDailyRecord from "@/hooks/DailyRecord/useGetAllDailyRecords";
import type { DailyRecordResponse } from "@/types";

const DailyReport = () => {
  // const BASE_URL = import.meta.env.VITE_API_URL;
  // const [report, setReport] = useState<DailyRecordFormData[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<DailyRecordResponse>();

  const { data: records } = useGetAllDailyRecord();
  // console.log("records1", records);
  // useEffect(() => {
  //   const fetchReport = async () => {
  //     const response = await axios.get(`${BASE_URL}/api/dailyrecord`);

  //     setReport(response.data);
  //     console.log("report", response.data);
  //   };

  //   fetchReport();
  // }, []);

  const handleEdit = (record: DailyRecordResponse) => {
    setEditRecord(record);
    setModalOpen(!isModalOpen);
  };

  const columns = [
    {
      key: "date",
      label: "Date",
      render: (value: string) => dayjs(value).format("DD/MM/YYYY"),
    },
    { key: "birdAgeInDays", label: "Age" },
    { key: "feedConsumedBags", label: "Feed(Bag)" },
    { key: "mortalityCount", label: "Mortality" },
  ];

  return (
    <div className="py-2 mb-10">
      <DataTable data={records?.data} columns={columns} onRowClick={handleEdit} />
      {editRecord && (
        <EditDailyRecordModal
          editData={editRecord}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(!isModalOpen)}
        />
      )}
    </div>
  );
};

export default DailyReport;
