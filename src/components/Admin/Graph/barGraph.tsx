import * as React from 'react';
import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';

export default function BarAnimation({ graphData }) {

  console.log(graphData,"kitty")
  const [seriesNb, setSeriesNb] = React.useState(2);
  const [itemNb, setItemNb] = React.useState(5);
  const [skipAnimation, setSkipAnimation] = React.useState(false);

  // Process graphData into a suitable format for the BarChart
  const processedData = graphData.map((data) => ({
    label: data.courseTitle,  // Use courseTitle as label
    data: [data.totalAdminShare],  // Wrap totalAdminShare in an array for the chart data
  }));



  return (
    <Box sx={{ width: '100%' }}>
      <BarChart
        height={300}
        series={processedData.slice(0, seriesNb).map((s) => ({ ...s, data: s.data.slice(0, itemNb) }))}
        skipAnimation={skipAnimation}
      />
    </Box>
  );
}
