import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const LineChart = ({ scores, dates }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const chartConfig = {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Scores',
            data: scores,
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.1
          }
        ]
      },
      options: {
        scales: {
          x: {
            offset: true
          },
          y: {
            min: 0,
            max: 10
          }
        }
      }
    };
    
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    
    chartRef.current = new Chart(canvasRef.current, chartConfig);
    
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [scores, dates]);

  return (
    <div >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default LineChart;
