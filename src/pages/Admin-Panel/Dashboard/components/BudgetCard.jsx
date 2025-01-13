import React, { useState, useEffect } from "react";
import { fetchYearlyEarningStatistics } from "../../../../utility/Api";

const BudgetCard = () => {
  const [year, setYear] = useState("2024");
  const [budgetData, setBudgetData] = useState({
    spent: 0,
    total: 56800, // Assuming the total budget is fixed
  });
  const [years, setYears] = useState([]);
  const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    for (let i = 2000; i <= currentYear; i++) {
      yearsArray.push(i.toString());
    }
    setYears(yearsArray);
  }, []);

  useEffect(() => {
    const getBudgetData = async () => {
      try {
        const newSpent = await fetchYearlyEarningStatistics(profile.partner_session_token, year);
        setBudgetData((prevData) => ({
          ...prevData,
          spent: newSpent,
        }));
      } catch (error) {
        console.error("Error fetching budget data:", error);
      }
    };

    getBudgetData();
  }, [year, profile.partner_session_token]);

  const handleChangeYear = (event) => {
    const selectedYear = event.target.value;
    setYear(selectedYear);
  };

  // Create SVG path based on the spent percentage
  const calculatePath = () => {
    const percentage = budgetData.spent / budgetData.total;
    return `M0,20 L20,${20 - 20 * percentage} L40,${20 - 15 * percentage} L60,${
      5 + 15 * percentage
    } L80,${10 + 10 * percentage} L100,${20 - 20 * percentage}`;
  };

  return (
    <div className="bg-white w-full rounded-lg shadow md:py-28 py-14 xl:py-24 px-5">
      <div className="mb-4 justify-center mx-auto flex">
        <select
          className="justify-center p-2 rounded bg-white text-[#00936C] border-2 border-[#00936C] focus:outline-none focus:border-[#00936C] focus:text-[#00936C] focus:bg-white"
          value={year}
          onChange={handleChangeYear}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="text-3xl text-[#4B465C] font-semibold text-[26px] text-center mb-1">
        ${budgetData.spent.toLocaleString()}
      </div>
      <svg viewBox="0 0 100 20" className="w-full h-12 mb-4">
        <path
          d={calculatePath()}
          stroke="teal"
          fill="transparent"
          className="text-[#00936C]"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default BudgetCard;
