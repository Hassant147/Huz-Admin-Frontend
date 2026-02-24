import React, { useMemo } from "react";
import { FaFilePdf, FaFileWord, FaFileImage } from "react-icons/fa";
import {
  AppButton,
  AppCard,
  AppEmptyState,
  AppSectionHeader,
} from "../../../../../../components/ui";
import errorIcon from "../../../../../../assets/error.svg";
import { formatDateTime, withFallback } from "../bookingDetailsUtils";

const getFileIcon = (filename) => {
  const extension = `${filename || ""}`.split(".").pop().toLowerCase();
  switch (extension) {
    case "pdf":
      return <FaFilePdf className="text-red-500" />;
    case "doc":
    case "docx":
      return <FaFileWord className="text-blue-500" />;
    case "png":
    case "jpg":
    case "jpeg":
      return <FaFileImage className="text-green-500" />;
    default:
      return <FaFileImage className="text-gray-500" />;
  }
};

const AirlineDetails = ({ booking }) => {
  const { REACT_APP_API_BASE_URL } = process.env;
  const airlineDetails = booking?.booking_airline_details || [];
  const airlineDocuments = useMemo(() => {
    return (booking?.booking_documents || []).filter(
      (doc) => `${doc.document_for || ""}`.toLowerCase() === "airline"
    );
  }, [booking]);

  return (
    <AppCard className="border-slate-200">
      <div className="app-content-stack">
        <AppSectionHeader
          title="Airline Details"
          subtitle="Flights and uploaded airline tickets"
        />

        {airlineDetails.length ? (
          <div className="space-y-3">
            {airlineDetails.map((detail, index) => (
              <article
                key={`${detail.flight_from || "flight"}-${index}`}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoTile label="Flight Date" value={formatDateTime(detail.flight_date)} />
                  <InfoTile label="Flight Time" value={withFallback(detail.flight_time)} />
                  <InfoTile label="From" value={withFallback(detail.flight_from)} />
                  <InfoTile label="To" value={withFallback(detail.flight_to)} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <AppEmptyState
            icon={<img src={errorIcon} alt="" className="h-6 w-6" />}
            title="No airline records"
            message="Airline ticket details are not available for this booking."
          />
        )}

        {airlineDocuments.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {airlineDocuments.map((doc) => {
              const fileName = `${doc.document_link || ""}`.split("/").pop();
              const documentUrl = `${REACT_APP_API_BASE_URL}${doc.document_link}`;
              return (
                <article
                  key={doc.document_id || doc.document_link}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-3"
                >
                  <div className="flex items-center gap-2 text-sm text-ink-700">
                    {getFileIcon(doc.document_link)}
                    <span className="max-w-[180px] truncate">{withFallback(fileName)}</span>
                  </div>
                  <AppButton
                    as="a"
                    href={documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                    variant="outline"
                  >
                    Open
                  </AppButton>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-ink-500">No airline documents uploaded.</p>
        )}
      </div>
    </AppCard>
  );
};

const InfoTile = ({ label, value }) => {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-300">{label}</p>
      <p className="mt-1 text-sm text-ink-700">{value}</p>
    </div>
  );
};

export default AirlineDetails;
