import { PieChart } from "@mui/x-charts/PieChart";
import { useTheme } from "@mui/material/styles";


interface TutorPieGraphProps {
  data: any; // Allow flexibility to inspect invalid data
}

export default function TutorPieGraph({ data }: TutorPieGraphProps) {
  const theme = useTheme();

  console.log("Data received in pie graph:", data); // Debugging the incoming data

  // Ensure data is an array before proceeding
  const pieData = Array.isArray(data)
    ? data.map((item, index) => ({
        id: index, // Unique ID for each slice
        value: item.totalStudents, // Total students for the pie slice
        label: item.courseName, // Course name as label
        color:
          index === 0
            ? theme.palette.primary.main
            : index === 1
            ? theme.palette.secondary.main
            : theme.palette.success.main, // Dynamically assign color
      }))
    : []; // Default to an empty array if data is not valid

  if (!Array.isArray(data)) {
    console.error(
      "Invalid data format for pie chart. Expected an array but received:",
      data
    );
    return (
      <div>
        {data?.message || "Unable to load data for the pie chart."}
      </div>
    ); // Render fallback UI
  }

  return (
    <PieChart
      series={[
        {
          data: pieData, // Use processed pie data
          highlightScope: { faded: "global", highlighted: "item" },
          faded: {
            innerRadius: 30,
            additionalRadius: -30,
            color: theme.palette.action.disabledBackground, // Faded color
          },
        },
      ]}
      height={200} // Adjust chart height as needed
    />
  );
}
