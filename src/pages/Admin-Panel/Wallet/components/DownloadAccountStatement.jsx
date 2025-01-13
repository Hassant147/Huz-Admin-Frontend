import React from "react";
import DownloadIcon from "../../../../assets/Download Icon.svg";
import ExcelDownload from "../../../../assets/Excel Download.svg";
import PDFIcon from "../../../../assets/PDF Icon.svg";

const DownloadAccountStatement = () => {
  return (
    <>
      <div className="px-6 py-4 flex flex-row justify-between">
        <div>
          <h1 className="font-poppins text-[#FFFFFF] font-semibold">
            Download Account Statement
          </h1>
          <p
            className="font-poppins text-[#FFFFFF]"
            style={{ fontSize: "11px" }}
          >
            Download full statement up to current date
          </p>
        </div>
        <button>
          <img src={DownloadIcon} alt="Image not found" />
        </button>
      </div>
      <div className="flex flex-row space-x-2 p-5 pt-0 ">
        <button
          className="flex flex-row items-center space-x-1 p-2 rounded-md"
          style={{ backgroundColor: "#EBF6F3" }}
        >
          <img src={ExcelDownload} alt="no" />
          <span className="font-poppins text-xs text-[#4B465C]">
            Excel Download
          </span>
        </button>
        <button
          className="flex flex-row items-center space-x-1  p-2 rounded-md"
          style={{ backgroundColor: "#EBF6F3" }}
        >
          <img src={PDFIcon} alt="no" />
          <span className="font-poppins text-xs text-[#4B465C]">
            Pdf Download
          </span>
        </button>
      </div>
    </>
  );
};

export default DownloadAccountStatement;
