import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

const PieChart = ({ month }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPieChartData();
  }, [month]);

  const fetchPieChartData = async () => {
    try {
      const res = await axios.get(`/pie-chart`, { params: { month } });
      setData(res.data);
    } catch (error) {
      console.error("Error fetching pie chart data", error);
    }
  };

  const chartData = {
    labels: data.map(d => d._id),
    datasets: [{
      data: data.map(d => d.count),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
    }]
  };

  return <Pie data={chartData} />;
};

export default PieChart;
