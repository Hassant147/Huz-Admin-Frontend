import React, { useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BookingContext } from "../../../../../context/BookingContext";
import { manageTravelerIssue } from "../../../../../utility/Api";

const formatDate = (value) => {
  if (!value) {
    return "N/A";
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ReportedTravelers = ({ booking }) => {
  const [loadingTravelerId, setLoadingTravelerId] = useState("");
  const { refreshBookingDetails } = useContext(BookingContext);

  const { partner_session_token: partnerSessionToken } = JSON.parse(
    localStorage.getItem("SignedUp-User-Profile") || "{}"
  );

  const travelers = useMemo(
    () => (Array.isArray(booking?.travelers) ? booking.travelers : []),
    [booking?.travelers]
  );
  const canManageTravelerIssues = Boolean(booking?.actions?.canManageTravelerIssues);
  const travelerIssues = useMemo(
    () =>
      Array.isArray(booking?.traveler_issues_normalized)
        ? booking.traveler_issues_normalized
        : [],
    [booking?.traveler_issues_normalized]
  );

  const handleIssueAction = async (traveler, action, issue) => {
    setLoadingTravelerId(traveler?.id || "");
    try {
      await manageTravelerIssue({
        partnerSessionToken,
        bookingNumber: booking?.booking_number,
        passportId: action === "report" ? traveler?.id : undefined,
        travelerIssueId: issue?.id,
        action,
        issueType: issue?.issueType || "reported",
      });
      await refreshBookingDetails(booking?.booking_number);
      toast.success(
        action === "resolve"
          ? "Traveler issue resolved."
          : action === "reopen"
          ? "Traveler issue reopened."
          : "Traveler reported successfully."
      );
    } catch (error) {
      console.error("Traveler issue action failed:", error);
      toast.error("Failed to update traveler issue.");
    } finally {
      setLoadingTravelerId("");
    }
  };

  if (travelers.length === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-amber-950">
          Traveler issue management
        </h2>
        <p className="text-sm text-amber-900">
          Traveler issues are handled per traveler. Admin can report, resolve, or reopen issues without treating the whole booking as one flat problem.
        </p>
      </div>

      <div className="space-y-3">
        {travelers.map((traveler) => {
          const openIssue = traveler?.openIssues?.[0] || null;
          const travelerHistory = travelerIssues.filter(
            (issue) => issue.travelerId === traveler?.id
          );
          const isBusy = loadingTravelerId === traveler?.id;

          return (
            <article
              key={traveler?.id}
              className="rounded-lg border border-amber-200 bg-white p-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">
                      {traveler?.fullName || "Traveler"}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        openIssue
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {openIssue ? "Open issue" : "No open issue"}
                    </span>
                    {traveler?.groupLabel ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {traveler.groupLabel}
                      </span>
                    ) : null}
                  </div>

                  <div className="grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                    <p>Passport: {traveler?.passportNumber || "N/A"}</p>
                    <p>Type: {traveler?.travelerType || "N/A"}</p>
                    <p>DOB: {formatDate(traveler?.dateOfBirth)}</p>
                    <p>Expiry: {formatDate(traveler?.expiryDate)}</p>
                  </div>

                  {openIssue?.notes ? (
                    <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
                      {openIssue.notes}
                    </p>
                  ) : null}

                  {travelerHistory.length > 0 ? (
                    <div className="text-xs text-slate-500">
                      Issue history:{" "}
                      {travelerHistory.map((issue) =>
                        `${issue.issueType} (${issue.status})`
                      ).join(" • ")}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  {openIssue && canManageTravelerIssues ? (
                    <button
                      type="button"
                      onClick={() => handleIssueAction(traveler, "resolve", openIssue)}
                      disabled={isBusy}
                      className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Resolve
                    </button>
                  ) : null}

                  {!openIssue && travelerHistory.length > 0 && canManageTravelerIssues ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleIssueAction(
                          traveler,
                          "reopen",
                          travelerHistory[travelerHistory.length - 1]
                        )
                      }
                      disabled={isBusy}
                      className="rounded-md bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Reopen
                    </button>
                  ) : null}

                  {!openIssue && canManageTravelerIssues ? (
                    <button
                      type="button"
                      onClick={() => handleIssueAction(traveler, "report")}
                      disabled={isBusy}
                      className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Report traveler
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ReportedTravelers;
