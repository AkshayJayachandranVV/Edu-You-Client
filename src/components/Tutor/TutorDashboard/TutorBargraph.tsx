import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';

export default function TutorBarGraph({ data }) {  // Destructure 'data' from props
  const theme = useTheme();

  // Extract the course titles and total tutor share values from the data
  const xAxisData = data.map(item => item.title); // Titles for the x-axis
  const seriesData = data.map(item => item.totalTutorShare); // Values for the bars

  return (
    <BarChart
      xAxis={[{
        scaleType: 'band',
        data: xAxisData, // Dynamic course titles
        tick: {
          fill: theme.palette.text.primary, // Text color for ticks
        },
      }]}
      series={[{
        data: seriesData, // Dynamic total tutor share values
        color: theme.palette.primary.main, // Bar color
      }]}
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
