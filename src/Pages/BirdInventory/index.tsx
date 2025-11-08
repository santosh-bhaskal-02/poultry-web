import BirdInventory from "@/components/BirdInventory";

const BirdInventoryPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bird Inventory</h1>
      <BirdInventory />
    </div>
  );
};

export default BirdInventoryPage;
