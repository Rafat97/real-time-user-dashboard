import { useQuery } from '@tanstack/react-query';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Top15UserCounterApiCall } from '../../api/totalCountry';
import { randomBgColor } from '../../utils/randomBg';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export default function TopActiveUserCountLayout() {
  const { data } = useQuery(
    ['TopActiveUserCountLayout'],
    Top15UserCounterApiCall,
    {
      initialData: [],
      refetchInterval: 5000,
    }
  );

  const genderData = {
    datasets: [
      {
        backgroundColor: [...data.map((data) => randomBgColor())],
        barPercentage: 0.5,
        barThickness: 30,
        borderRadius: 100,
        categoryPercentage: 0.5,
        data: [...data.map((data) => data.sum)],
      },
    ],
    labels: [...data.map((data) => data.user.name)],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        color: 'white',
        text: 'Top 15 Users',
      },
    },
  };

  return (
    <div>
      <Bar data={genderData} options={options} />
    </div>
  );
}
