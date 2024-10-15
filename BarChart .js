import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const BarChart = ({ month }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchBarChartData();
  }, [month]);

  const fetchBarChartData = async () => {
    try {
      const res = await axios.get(`/bar-chart`, { params: { month } });
      setData(res.data);
    } catch (error) {
      console.error("Error fetching bar chart data", error);
    }
  };

  const chartData = {
    labels: data.map(d => d.range),
    datasets: [{
      label: 'Number of items',
      data: data.map(d => d.count),
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    }]
  };

  return <Bar data={chartData} />;
};

export default BarChart;
