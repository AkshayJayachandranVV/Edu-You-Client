import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';

export default function TutorBarGraph() {
  const theme = useTheme();

  return (
    <BarChart
      xAxis={[
        {
          scaleType: 'band',
          data: ['group A', 'group B', 'group C'],
          tick: {
            fill: theme.palette.text.primary, // Text color for ticks
          },
        },
      ]}
      series={[
        {
          data: [4, 3, 5],
          color: theme.palette.primary.main, // Bar color
        },
        {
          data: [1, 6, 3],
          color: theme.palette.secondary.main, // Secondary bar color
        },
        {
          data: [2, 5, 6],
          color: theme.palette.success.main, // Success bar color
        },
      ]}
      width={500}
      height={300}
      theme={{
        background: {
          default: theme.palette.background.default, // Background color for the chart
        },
        grid: {
          stroke: theme.palette.divider, // Grid line color
        },
      }}
    />
  );
}
