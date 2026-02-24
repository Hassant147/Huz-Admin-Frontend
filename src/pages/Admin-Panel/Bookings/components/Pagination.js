import React from "react";
import { AppButton } from "../../../../components/ui";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handleClick = (page) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <AppButton
          key={i}
          variant={currentPage === i ? "primary" : "outline"}
          size="sm"
          className="min-w-[40px] rounded-full"
          onClick={() => handleClick(i)}
        >
          {i}
        </AppButton>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <AppButton
        variant="outline"
        size="sm"
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </AppButton>
      {renderPageNumbers()}
      <AppButton
        variant="outline"
        size="sm"
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </AppButton>
    </div>
  );
};

export default Pagination;
