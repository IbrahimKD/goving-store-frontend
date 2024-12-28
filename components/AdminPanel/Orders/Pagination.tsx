import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

const Pagination = ({
  currentPageIndex,
  pageRowCount,
  totalRows,
  onPageChange,
  onPageSizeChange,
}: any) => {
  const totalPages = Math.ceil(totalRows / pageRowCount);

  return (
    <div className="flex justify-between w-full items-center mt-4">
      <div>
        <span>
          Page {currentPageIndex + 1} of {totalPages}
        </span>
        {onPageSizeChange && (
          <select
            value={pageRowCount}
            onChange={(e) => onPageSizeChange(e)}
            className="ml-2 border-gray-300 text-black rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        )}
      </div>
      <div className="space-x-2">
        <button
          disabled={currentPageIndex === 0}
          onClick={() => onPageChange(currentPageIndex - 1)}
          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-md disabled:opacity-50"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
        <button
          disabled={currentPageIndex >= totalPages - 1}
          onClick={() => onPageChange(currentPageIndex + 1)}
          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-md disabled:opacity-50"
        >
          <FaArrowRight className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
