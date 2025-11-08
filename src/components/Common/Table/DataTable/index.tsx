import dayjs from "dayjs";

interface TableColumn<T> {
  key: keyof T;
  label: string;
}
interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (item: T) => void;
}

function DataTable<T extends object>({ data, columns, onRowClick }: DataTableProps<T>) {
  console.log("Data in dataTable", data);
  return (
    <div className="overflow-x-auto shadow-lg rounded-md">
      <table className="min-w-full border-collapse bg-white text-sm text-left">
        <thead>
          <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white  text-sm tracking-wider">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-2 border-b border-blue-200 text-center">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr
              key={index}
              className={`transition-all duration-300 hover:bg-blue-50 ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
              onClick={() => onRowClick?.(item)}>
              {columns.map((col) => (
                <td className="px-4 py-2 border-b border-gray-200 text-gray-700 text-center">
                  {col.key == "date"
                    ? dayjs(item[col.key]).format("DD/MM/YYYY")
                    : String(item[col.key] ?? "")}
                </td>
              ))}

              {/* <td className="px-4 py-2 border-b border-gray-200 text-gray-700 text-center">
                {dayjs(item?.date).format("DD/MM/YYYY")}
              </td>
              <td className="px-4 py-2 border-b border-gray-200 text-gray-700 text-center">
                {item?.birdAgeInDays}
              </td>
              <td className="px-4 py-2 border-b border-gray-200 text-gray-700 text-center">
                {item?.feedConsumedBags}
              </td>
              <td className="px-4 py-2 border-b border-gray-200 text-gray-700 text-center">
                {item?.mortalityCount}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
