import React from 'react';
import { hasReportedIssueState, normalizeIssueStatus } from '../bookingWorkflowUtils';

const Objection = ({booking}) => {
  if (!booking) {
    return null;
  }

  const latestObjection = booking?.booking_objections?.[0];
  const issueStatus = normalizeIssueStatus(booking?.issue_status);
  const isReported = issueStatus !== 'OPERATOR_OBJECTION' && hasReportedIssueState(booking);


  return (
    <div className="p-4 bg-white border border-gray-300 shadow-sm rounded-lg space-y-3">
      <div>
        <h2 className="text-lg font-medium text-gray-700">
          {isReported ? 'Traveler issues' : 'Operator objection'}
        </h2>
        <p className="text-sm text-gray-500">
          {isReported
            ? 'This booking is in the issue workflow because one or more traveler issues are still open.'
            : 'Fulfillment is paused because the operator requested a traveler correction or more supporting detail.'}
        </p>
      </div>
      {isReported ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-amber-700">Reported travelers</p>
          <p className="mt-1 text-sm font-medium text-amber-900">
            {(booking?.open_traveler_issues || []).length || 0} open traveler issue
            {(booking?.open_traveler_issues || []).length === 1 ? '' : 's'} require action.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-rose-600">Latest objection</p>
          <p className="mt-1 text-sm font-medium text-rose-700">
            {latestObjection?.remarks_or_reason || booking.partner_remarks || "No objection details available."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Objection;
