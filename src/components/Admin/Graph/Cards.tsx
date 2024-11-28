import React from "react";

interface StatsCardProps {
  title: string;
  value: number | string; // Value can be a number or string depending on use case
  bgColor: string; // CSS class for background color
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, bgColor }) => {
  return (
    <div
      className={`flex items-center justify-center h-32 w-full md:w-1/4 mx-2 rounded-lg shadow-lg ${bgColor}`}
    >
      <div className="text-center text-white">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-3xl font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
