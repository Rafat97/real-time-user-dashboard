import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getTotalGenderCounterApiCall } from '../../api/userCounter';
import { Bar, Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MaleFemaleCountLayout() {
  const { data } = useQuery(
    ['getTotalGenderCounter'],
    getTotalGenderCounterApiCall,
    {
      refetchInterval: 5000,
    }
  );

  const genderData = {
    datasets: [
      {
        backgroundColor: ['#004f94', '#fdc7b1'],
        barPercentage: 0.5,
        barThickness: 30,
        borderRadius: 100,
        categoryPercentage: 0.5,
        data: [data?.male || 0, data?.female || 0],
        label: 'Male',
      },
    ],
    labels: ['Male', 'Female'],
  };

  const options = {
    indexAxis: 'y',
    yAxes: [
      {
        ticks: {
          fontColor: '#FFF',
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
    ],
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        color: 'white',
        text: 'Total number of male & female',
      },
    },
  };
  return (
    <div>
      <Bar data={genderData} options={options} />
    </div>
  );
}
