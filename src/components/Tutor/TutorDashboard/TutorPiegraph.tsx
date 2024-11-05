import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useTheme } from '@mui/material/styles';

export default function TutorPieGraph({ data }) { // Destructure 'data' from props
  const theme = useTheme();


  console.log(data,"dataa reaching in pie graph -----------")


  // Map through the data to create the structure needed for PieChart
  const pieData = data.map((item, index) => ({
    id: index, // Unique ID for each slice
    value: item.totalStudents, // Total students for the pie slice
    label: item.courseName, // Course ID or title as label
  }));

  return (
    <PieChart
      series={[{
        data: pieData, // Use the processed pie data
        highlightScope: { faded: 'global', highlighted: 'item' },
        faded: {
          innerRadius: 30,
          additionalRadius: -30,
          color: 'gray',
        },
        // Customize the slice colors
        color: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.success.main,
        ],
      }]}
      height={200}
      theme={{
        background: {
          default: theme.palette.background.default, // Background color for the chart
        },
      }}
    />
  );
}