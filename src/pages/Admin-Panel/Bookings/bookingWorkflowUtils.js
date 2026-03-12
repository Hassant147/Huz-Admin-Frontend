const CANONICAL_BOOKING_STATUSES = new Set([
  "HOLD",
  "TRAVELER_DETAILS_PENDING",
  "AWAITING_FINAL_PAYMENT",
  "READY_FOR_OPERATOR",
  "IN_FULFILLMENT",
  "READY_FOR_TRAVEL",
  "COMPLETED",
  "CANCELLED",
  "EXPIRED",
]);
const CANONICAL_ISSUE_STATUSES = new Set(["NONE", "OPERATOR_OBJECTION", "REPORTED"]);
const FULFILLMENT_MANAGEABLE_STATUSES = new Set(["IN_FULFILLMENT", "READY_FOR_TRAVEL"]);

export const WORKFLOW_OPTIONS = [
  { value: "VIEW_ONLY", label: "View Only" },
  { value: "READY", label: "Ready" },
  { value: "FULFILLMENT", label: "In Fulfillment" },
  { value: "READY_FOR_TRAVEL", label: "Ready for Travel" },
  { value: "ISSUES", label: "Issues" },
  { value: "COMPLETED", label: "Completed" },
  { value: "HISTORY", label: "History" },
];

const WORKFLOW_META = {
  VIEW_ONLY: {
    label: "View Only",
    badgeTone: "bg-slate-100 text-slate-700 font-semibold",
  },
  READY: {
    label: "Ready",
    badgeTone: "bg-amber-100 text-amber-700 font-semibold",
  },
  FULFILLMENT: {
    label: "In Fulfillment",
    badgeTone: "bg-emerald-100 text-emerald-700 font-semibold",
  },
  READY_FOR_TRAVEL: {
    label: "Ready for Travel",
    badgeTone: "bg-cyan-100 text-cyan-700 font-semibold",
  },
  ISSUES: {
    label: "Issue",
    badgeTone: "bg-rose-100 text-rose-700 font-semibold",
  },
  COMPLETED: {
    label: "Completed",
    badgeTone: "bg-slate-200 text-slate-700 font-semibold",
  },
  HISTORY: {
    label: "History",
    badgeTone: "bg-zinc-200 text-zinc-700 font-semibold",
  },
};

export const normalizeBookingStatus = (value) => {
  const normalized = `${value || ""}`.trim().toUpperCase();
  if (CANONICAL_BOOKING_STATUSES.has(normalized)) {
    return normalized;
  }

  return "";
};

export const normalizeIssueStatus = (value) => {
  const normalized = `${value || ""}`.trim().toUpperCase();
  if (CANONICAL_ISSUE_STATUSES.has(normalized)) {
    return normalized;
  }

  return "";
};

export const normalizeWorkflowBucket = (value) => `${value || ""}`.trim().toUpperCase();

export const canManageFulfillmentDetails = (bookingOrStatus) =>
  FULFILLMENT_MANAGEABLE_STATUSES.has(
    normalizeBookingStatus(
      bookingOrStatus && typeof bookingOrStatus === "object"
        ? bookingOrStatus?.booking_status
        : bookingOrStatus
    )
  );

export const getWorkflowBucketLabel = (value) =>
  WORKFLOW_META[normalizeWorkflowBucket(value)]?.label || "Booking";

export const getBookingWorkflowBucket = (booking) => {
  const workflowBucket = normalizeWorkflowBucket(booking?.workflow_bucket);
  if (workflowBucket) {
    return workflowBucket;
  }

  const issueStatus = normalizeIssueStatus(booking?.issue_status);
  if (issueStatus === "OPERATOR_OBJECTION" || issueStatus === "REPORTED") {
    return "ISSUES";
  }

  switch (normalizeBookingStatus(booking?.booking_status)) {
    case "TRAVELER_DETAILS_PENDING":
    case "AWAITING_FINAL_PAYMENT":
      return "VIEW_ONLY";
    case "READY_FOR_OPERATOR":
      return "READY";
    case "IN_FULFILLMENT":
      return "FULFILLMENT";
    case "READY_FOR_TRAVEL":
      return "READY_FOR_TRAVEL";
    case "COMPLETED":
      return "COMPLETED";
    case "CANCELLED":
    case "EXPIRED":
      return "HISTORY";
    default:
      return "";
  }
};

export const getBookingDisplayMeta = (booking) => {
  const workflowBucket = getBookingWorkflowBucket(booking);
  const issueStatus = normalizeIssueStatus(booking?.issue_status);
  if (issueStatus === "OPERATOR_OBJECTION") {
    return {
      label: "Operator Objection",
      badgeTone: WORKFLOW_META.ISSUES.badgeTone,
    };
  }

  if (issueStatus === "REPORTED") {
    return {
      label: "Reported",
      badgeTone: WORKFLOW_META.ISSUES.badgeTone,
    };
  }

  return WORKFLOW_META[workflowBucket] || {
    label: normalizeBookingStatus(booking?.booking_status) || "Booking",
    badgeTone: "bg-gray-200 text-gray-800 font-semibold",
  };
};

export const getBookingWorkflowScreen = (booking) => {
  const issueStatus = normalizeIssueStatus(booking?.issue_status);
  if (issueStatus === "OPERATOR_OBJECTION") {
    return "ISSUE";
  }

  switch (normalizeBookingStatus(booking?.booking_status)) {
    case "TRAVELER_DETAILS_PENDING":
    case "AWAITING_FINAL_PAYMENT":
      return "VIEW_ONLY";
    case "READY_FOR_OPERATOR":
      return "READY";
    case "IN_FULFILLMENT":
      return "FULFILLMENT";
    case "READY_FOR_TRAVEL":
      return "READY_FOR_TRAVEL";
    case "COMPLETED":
      return "COMPLETED";
    case "CANCELLED":
    case "EXPIRED":
      return "HISTORY";
    default:
      return "VIEW_ONLY";
  }
};
