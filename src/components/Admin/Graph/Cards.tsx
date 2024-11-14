import React,{useEffect,useState} from 'react';



const StatsCard = ({ title, value, bgColor }) => {


  return (
    <div className={`flex items-center justify-center h-32 w-full md:w-1/4 mx-2 rounded-lg shadow-lg ${bgColor}`}>
      <div className="text-center text-white">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-3xl font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
