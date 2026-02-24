import React, { useState, useEffect } from 'react';
import icon from '../../../../assets/progresspackage.svg';
import icon1 from '../../../../assets/deactivatedashboardicon.svg';
import icon2 from '../../../../assets/progressdashboardicon.svg';
import { fetchPackageStatistics } from '../../../../utility/Api';
import Loader from '../../../../components/loader'; // Assuming your loader is here
import { AppCard } from "../../../../components/ui";
import { getPartnerSessionToken } from "../../../../utility/session";

const DashboardStats = () => {
  const [packagesData, setPackagesData] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const getPackageStatistics = async () => {
      try {
        const result = await fetchPackageStatistics(getPartnerSessionToken());
        setPackagesData([
          {
            id: 1,
            title: 'In progress packages',
            value: Number(result.Initialize || 0).toString(),
            icon: icon,
          },
          {
            id: 2,
            title: 'Deactivated packages',
            value: Number(result.Deactivated || 0).toString(),
            icon: icon1,
          },
          {
            id: 3,
            title: 'Active packages',
            value: Number(result.Active || 0).toString(),
            icon: icon2,
          },
        ]);
      } catch (error) {
        console.error('Error fetching package statistics:', error);
      } finally {
        setLoading(false); // Set loading to false after the data is fetched
      }
    };

    getPackageStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader /> {/* Show the loader while loading */}
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
      {packagesData.map((pkg) => (
        <StatCard key={pkg.id} icon={pkg.icon} title={pkg.title} value={pkg.value} />
      ))}
    </div>
  );
};

const StatCard = ({ icon, title, value }) => {
  const targetValue = parseInt(value.replace(/,/g, ''), 10);
  const [currentValue, setCurrentValue] = useState(Math.max(0, targetValue - 40));

  useEffect(() => {
    const intervalTime = 20;
    const incrementPerStep = 1;

    const interval = setInterval(() => {
      setCurrentValue((prevValue) => {
        if (prevValue < targetValue) {
          return prevValue + incrementPerStep;
        } else {
          clearInterval(interval);
          return prevValue;
        }
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [targetValue]);

  return (
    <div className="w-full">
      <AppCard className="flex w-full items-center border-slate-200 lg:min-h-[104px] min-h-[80px]">
        <img src={icon} className="w-[54px] h-[54px] text-green-500" alt="icon" />
        <div className="ml-4">
          <h1 className="text-[#4B465C] text-[15px] leading-[22px] font-normal">
            {title}
          </h1>
          <p className="text-[#4B465C] font-semibold text-[22px] leading-[30px]">
            {currentValue.toLocaleString()}
          </p>
        </div>
      </AppCard>
    </div>
  );
};

export default DashboardStats;
