import * as React from "react";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";

interface GraphData {
  courseTitle: string;
  totalAdminShare: number;
}

interface BarAnimationProps {
  graphData: GraphData[];
}

export default function BarAnimation({ graphData }: BarAnimationProps) {
  console.log(graphData, "Processed graph data");

  const [seriesNb] = React.useState(2);
  const [itemNb] = React.useState(5);
  const [skipAnimation] = React.useState(false);

  // Transform graphData into a format suitable for BarChart
  const processedData = [
    {
      label: "Admin Share",
      data: graphData.map((data) => data.totalAdminShare),
    },
  ];

  const xLabels = graphData.map((data) => data.courseTitle);

  return (
    <Box sx={{ width: "100%" }}>
      <BarChart
        height={300}
        xAxis={[{ scaleType: "band", data: xLabels }]} // xAxis labels for courses
        series={processedData.slice(0, seriesNb).map((s) => ({
          ...s,
          data: s.data.slice(0, itemNb),
        }))}
        skipAnimation={skipAnimation}
      />
    </Box>
  );
}
