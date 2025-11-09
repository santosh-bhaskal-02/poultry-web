import { useState } from "react";
import dayjs from "dayjs";
import { DataTable } from "@/components/Common/Table";
import useGetAllBirdInventories from "@/hooks/BirdInventory/useGetAllBirdInventories";
import EditBirdInventoryModal from "@/components/Common/Modal/EditBirdInventory";
import type { BirdInventoryFormData } from "@/types";

const BirdsInventoryReport = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<BirdInventoryFormData>();

  const { data: reports } = useGetAllBirdInventories();

  const handleEdit = (record: BirdInventoryFormData) => {
    setEditRecord(record);
    setModalOpen(!isModalOpen);
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

  return (
    <div className="px-2 py-5">
      <DataTable data={reports?.data} columns={columns} onRowClick={handleEdit} />
      {editRecord && (
        <EditBirdInventoryModal
          editData={editRecord}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(!isModalOpen)}
        />
      )}
    </div>
  );
};

export default BirdsInventoryReport;
