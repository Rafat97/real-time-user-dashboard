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
import { randomBgColor } from '../../utils/randomBg';
import { getDeviceCounterApiCall } from '../../api/userCounter';
import { Grid } from '@mantine/core';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DeviceCounterLayout() {
  const { data } = useQuery(['DeviceCounterLayout'], getDeviceCounterApiCall, {
    initialData: {
      deviceOsName: [],
      deviceBrowserName: [],
    },
    refetchInterval: 1000,
  });

  const deviceOsData = {
    datasets: [
      {
        backgroundColor: [...data.deviceOsName.map((data) => randomBgColor())],
        barPercentage: 0.5,
        barThickness: 30,
        borderRadius: 100,
        categoryPercentage: 0.5,
        data: [...data.deviceOsName.map((data) => data.sum)],
      },
    ],
    labels: [...data.deviceOsName.map((data) => data.name)],
  };

  const deviceBrowserData = {
    datasets: [
      {
        backgroundColor: [
          ...data.deviceBrowserName.map((data) => randomBgColor()),
        ],
        barPercentage: 0.5,
        barThickness: 30,
        borderRadius: 100,
        categoryPercentage: 0.5,
        data: [...data.deviceBrowserName.map((data) => data.sum)],
      },
    ],
    labels: [...data.deviceBrowserName.map((data) => data.name)],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        color: 'white',
      },
    },
  };

  return (
    <div>
      <Grid>
        <Grid.Col span={6}>
          <Bar data={deviceOsData} options={options} />
        </Grid.Col>
        <Grid.Col span={6}>
          <Bar data={deviceBrowserData} options={options} />
        </Grid.Col>
      </Grid>
    </div>
  );
}
