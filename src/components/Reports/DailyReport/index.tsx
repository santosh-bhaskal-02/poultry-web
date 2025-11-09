import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import EditDailyRecordModal from "../../Common/Modal/EditDailyRecord";
import { DataTable } from "@/components/Common/Table";
import type { DailyRecordFormData } from "@/types";
import useGetAllDailyRecord from "@/hooks/DailyRecord/useGetAllDailyRecords";

const DailyReport = () => {
  // const BASE_URL = import.meta.env.VITE_API_URL;
  // const [report, setReport] = useState<DailyRecordFormData[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState();

  const { data: records, isPending } = useGetAllDailyRecord();
  // console.log("records1", records);
  // useEffect(() => {
  //   const fetchReport = async () => {
  //     const response = await axios.get(`${BASE_URL}/api/dailyrecord`);

  //     setReport(response.data);
  //     console.log("report", response.data);
  //   };

  //   fetchReport();
  // }, []);

  const handleEdit = (record) => {
    console.log("rcort12", record);
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
    { key: "feedConsumedBags", label: "Feed(Bage)" },
    { key: "mortalityCount", label: "Mortality" },
  ];

  return (
    <div className="py-5">
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
