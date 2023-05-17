import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import './home.css'

const PieChart = ({ value1, value2, value3 }) => {
  const data = {
    labels: ['Non-Sustainable', 'Moderately Sustainable', 'Sustainable'],
    datasets: [
      {
        data: [value1, value2, value3],
        backgroundColor: ['#FF6384', '#FFCE56', '#4caf50'],
        hoverBackgroundColor: ['#FF6384', '#FFCE56', '#3e8e41'],
      },
    ],
  };

  return (
    <div className="chart-container">
      <Doughnut
        data={data}
        options={{ cutoutPercentage: 70 }}
      />
    </div>
  );
};

export default PieChart;
