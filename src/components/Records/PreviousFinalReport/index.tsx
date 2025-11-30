import dayjs from "dayjs";
import { DataTable } from "@/components/Common/Table";
import { useNavigate } from "react-router-dom";
import useGetAllFinalReports from "@/hooks/FinalReport/useGetAllFinalReports";

const PreviousFinalReport = () => {
  const navigate = useNavigate();

  const { data: records } = useGetAllFinalReports();

  const handleEdit = (record) => {
    // setEditRecord(record);
    // setModalOpen(!isModalOpen);
    navigate(`/report/${record.id}`);
  };

  const columns = [
    {
      key: "date",
      label: "Date",
      render: (value: string) => dayjs(value).format("DD/MM/YYYY"),
    },
    { key: "batchId", label: "No." },
    { key: "totalBirds", label: "Total Birds" },
    { key: "netCostPerKg", label: "Cost" },
    { key: "totalAmountPayable", label: "Amount" },
  ];

  return (
    <div className="py-2 mb-10">
      <DataTable data={records?.data} columns={columns} onRowClick={handleEdit} />
    </div>
  );
};

export default PreviousFinalReport;
