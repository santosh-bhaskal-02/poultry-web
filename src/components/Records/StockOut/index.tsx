import dayjs from "dayjs";
import { DataTable } from "@/components/Common/Table";
import useGetAllStockOutMasters from "@/hooks/StockOut/GetAllStockOutMasters";
import { useNavigate } from "react-router-dom";

const StockOutReport = () => {
  const navigate = useNavigate();

  const { data: records } = useGetAllStockOutMasters();

  const handleEdit = (record) => {
    // setEditRecord(record);
    // setModalOpen(!isModalOpen);
    navigate(`/stock-out/add/${record.id}`);
  };

  const columns = [
    {
      key: "date",
      label: "Date",
      render: (value: string) => dayjs(value).format("DD/MM/YYYY"),
    },
    { key: "stockOutNo", label: "No." },
    { key: "totalBirds", label: "Total Birds" },
    { key: "totalWeight", label: "Total Weight" },
    { key: "avgWeight", label: "Average Weight" },
  ];

  return (
    <div className="py-2 mb-10">
      <DataTable data={records?.data} columns={columns} onRowClick={handleEdit} />
    </div>
  );
};

export default StockOutReport;
