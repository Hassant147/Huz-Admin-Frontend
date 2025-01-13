import React from "react";

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleClick = (page) => {
    onPageChange(page);
  };

  return (
    <div className="flex justify-center mt-4">
      <nav>
        <ul className="flex list-none">
          {Array.from({ length: totalPages }, (_, index) => (
            <li
              key={index}
              className={`px-3 py-1 mx-1 border rounded-full ${
                currentPage === index + 1
                  ? "bg-[#00936C] text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              <button onClick={() => handleClick(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
