import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useTheme } from '@mui/material/styles';

const data = [
  { id: 0, value: 10, label: 'series A' },
  { id: 1, value: 15, label: 'series B' },
  { id: 2, value: 20, label: 'series C' },
];

export default function TutorPieGraph() {
  const theme = useTheme();

  return (
    <PieChart
      series={[
        {
          data,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: {
            innerRadius: 30,
            additionalRadius: -30,
            color: 'gray',
          },
          // Customize the slice colors for dark theme
          color: [
            theme.palette.primary.main, // Series A color
            theme.palette.secondary.main, // Series B color
            theme.palette.success.main, // Series C color
          ],
        },
      ]}
      height={200}
      theme={{
        background: {
          default: theme.palette.background.default, // Background color for the chart
        },
      }}
    />
  );
}
