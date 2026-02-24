import React from "react";
import { AppCard, AppEmptyState } from "../../../../components/ui";

const Error = ({ errorLogo, error }) => {
  return (
    <AppCard className="min-h-[300px]">
      <AppEmptyState
        icon={<img src={errorLogo} alt="" className="h-8 w-8" />}
        title="Nothing to show"
        message={error || "The selected filter returned no records."}
      />
    </AppCard>
  );
};

export default Error;
