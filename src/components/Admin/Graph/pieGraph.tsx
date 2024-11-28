
import { PieChart } from '@mui/x-charts/PieChart';
import { useTheme } from '@mui/material/styles';

interface PieGraphData {
  courseTitle: string; // Define the structure of each data item
  totalStudents: number;
}

interface TutorPieGraphProps {
  data: PieGraphData[]; // Ensure `data` is an array of `PieGraphData`
}

export default function TutorPieGraph({ data }: TutorPieGraphProps) {
  const theme = useTheme();

  // Define colors for the chart slices
  const sliceColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
  ];

  // Map through the data to create the structure needed for PieChart
  const pieData = data.map((item, index) => ({
    id: index, // Unique ID for each slice
    value: item.totalStudents, // Total students for the pie slice
    label: item.courseTitle, // Course name as label
    color: sliceColors[index % sliceColors.length], // Assign color cyclically
  }));

  return (
    <PieChart
      series={[
        {
          data: pieData, // Processed pie data
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: {
            innerRadius: 30,
            additionalRadius: -30,
            color: 'gray',
          },
        },
      ]}
      height={200}
    />
  );
}
