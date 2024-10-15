import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = ({ month }) => {
  const [stats, setStats] = useState({ totalSales: 0, soldItems: 0, unsoldItems: 0 });

  useEffect(() => {
    fetchStatistics();
  }, [month]);

  const fetchStatistics = async () => {
    try {
      const res = await axios.get(`/statistics`, { params: { month } });
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching statistics", error);
    }
  };

  return (
    <div>
      <div>Total Sales: ${stats.totalSales}</div>
      <div>Sold Items: {stats.soldItems}</div>
      <div>Unsold Items: {stats.unsoldItems}</div>
    </div>
  );
};

export default Statistics;
