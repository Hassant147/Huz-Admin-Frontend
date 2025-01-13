import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handleClick = (page) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handleClick(i)}
          className={`px-5 py-1 mx-1 rounded ${currentPage === i ? "bg-[#00936C] text-white" : "bg-gray-200"}`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex justify-end mt-4">
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-5 rounded mx-1 bg-gray-200"
      >
        Prev
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-5 rounded mx-1 bg-gray-200"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
