import React, { useMemo, useState, useEffect } from "react";
import { fetchYearlyEarningStatistics } from "../../../../utility/Api";
import { AppCard } from "../../../../components/ui";
import { getPartnerSessionToken } from "../../../../utility/session";

const BudgetCard = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());
  const [budgetData, setBudgetData] = useState({
    spent: 0,
    total: 56800,
  });

  const years = useMemo(() => {
    const yearsArray = [];
    for (let i = 2000; i <= currentYear; i += 1) {
      yearsArray.push(i.toString());
    }
    return yearsArray;
  }, [currentYear]);

  useEffect(() => {
    const getBudgetData = async () => {
      try {
        const newSpent = await fetchYearlyEarningStatistics(getPartnerSessionToken(), year);
        setBudgetData((prevData) => ({
          ...prevData,
          spent: Number(newSpent || 0),
        }));
      } catch (error) {
        console.error("Error fetching budget data:", error);
      }
    };

    getBudgetData();
  }, [year]);

  const calculatePath = () => {
    const safeTotal = budgetData.total || 1;
    const percentage = Math.min(1, Math.max(0, budgetData.spent / safeTotal));
    return `M0,20 L20,${20 - 20 * percentage} L40,${20 - 15 * percentage} L60,${
      5 + 15 * percentage
    } L80,${10 + 10 * percentage} L100,${20 - 20 * percentage}`;
  };

  return (
    <AppCard className="h-full">
      <div className="mb-4 flex justify-center">
        <select
          className="rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm font-semibold text-brand-700"
          value={year}
          onChange={(event) => setYear(event.target.value)}
        >
          {years.map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              {yearOption}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-1 text-center text-[26px] font-semibold text-[#4B465C]">
        ${budgetData.spent.toLocaleString()}
      </div>
      <p className="mb-5 text-center text-xs text-ink-500">Yearly revenue</p>
      <svg viewBox="0 0 100 20" className="h-12 w-full">
        <path
          d={calculatePath()}
          stroke="#0A8F67"
          fill="transparent"
          strokeWidth="2"
        />
      </svg>
    </AppCard>
  );
};

export default BudgetCard;
