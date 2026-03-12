import React from "react";

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

const buildMediaUrl = (value) => {
  const rawValue = `${value || ""}`.trim();
  const baseUrl = `${process.env.REACT_APP_API_BASE_URL || ""}`.trim().replace(/\/$/, "");

  if (!rawValue) {
    return "";
  }

  if (/^https?:\/\//i.test(rawValue)) {
    return rawValue;
  }

  let normalizedPath = rawValue;
  if (!rawValue.startsWith("/")) {
    normalizedPath = rawValue.startsWith("media/") ? `/${rawValue}` : `/media/${rawValue}`;
  }

  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
};

const ReportedTravelers = ({ booking }) => {
  const reportedTravelers = Array.isArray(booking?.traveller_detail)
    ? booking.traveller_detail.filter((traveler) => Boolean(traveler?.report_rabbit))
    : [];

  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-amber-950">Reported Travelers</h2>
        <p className="text-sm text-amber-900">
          Travelers marked with a reported issue by the operator workflow.
        </p>
      </div>

      {reportedTravelers.length ? (
        <div className="overflow-x-auto rounded-lg border border-amber-200 bg-white">
          <table className="min-w-full divide-y divide-amber-100 text-sm">
            <thead className="bg-amber-50 text-left text-xs uppercase tracking-wide text-amber-900">
              <tr>
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Passport</th>
                <th className="px-4 py-3">DOB</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3">Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100 text-gray-700">
              {reportedTravelers.map((traveler) => {
                const travelerName = `${traveler?.first_name || ""} ${traveler?.last_name || ""}`.trim();
                const photoUrl = buildMediaUrl(traveler?.user_photo);
                const passportUrl = buildMediaUrl(traveler?.user_passport);

                return (
                  <tr key={traveler?.passport_id || traveler?.traveller_id}>
                    <td className="px-4 py-3">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={travelerName || "Traveler"}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{travelerName || "N/A"}</td>
                    <td className="px-4 py-3">{traveler?.passport_number || "N/A"}</td>
                    <td className="px-4 py-3">{formatDate(traveler?.date_of_birth)}</td>
                    <td className="px-4 py-3">{traveler?.passport_country || "N/A"}</td>
                    <td className="px-4 py-3">{formatDate(traveler?.expiry_date)}</td>
                    <td className="px-4 py-3">
                      {passportUrl ? (
                        <a
                          href={passportUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0f766e] underline"
                        >
                          View Passport
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-amber-900">
          No travelers are currently marked as reported for this booking.
        </p>
      )}
    </section>
  );
};

export default ReportedTravelers;
