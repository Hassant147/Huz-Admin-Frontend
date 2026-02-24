import React from "react";
import { AppButton } from "../../../../components/ui";

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

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <nav className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;
          const isCurrent = currentPage === pageNumber;

          return (
            <AppButton
              key={pageNumber}
              variant={isCurrent ? "primary" : "outline"}
              size="sm"
              className="min-w-[40px] rounded-full px-3"
              onClick={() => handleClick(pageNumber)}
            >
              {pageNumber}
            </AppButton>
          );
        })}
      </nav>
    </div>
  );
};

export default Pagination;
