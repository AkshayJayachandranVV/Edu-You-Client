import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

// Container for the entire dashboard
const DashboardContainer = styled('div')(({ theme }) => ({
  backgroundColor: '#0a0c11',
  color: 'white',
  padding: '20px',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  boxSizing: 'border-box',
  overflowX: 'hidden',
  overflowY: 'hidden',
  width: '100%',
  maxWidth: '1800px',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    padding: '10px',
  },
}));

// Container for stats
const StatsContainer = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '20px',
  backgroundColor: '#161b22',
  borderRadius: '15px',
  padding: '16px',
  marginBottom: '20px',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.6)',
  border: '1px solid #2d3a4e',
  width: '100%',
  maxWidth: '1600px',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

// Individual stat item styling
const StatItem = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '15px',
  backgroundColor: '#1f2633',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
  transition: 'transform 0.3s ease-in-out, background-color 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: '#2b303f',
  },
});

// Stat value and label styling
const StatValue = styled('span')({
  fontSize: '24px',
  fontWeight: '700',
  color: '#67e8f9',
});

const StatLabel = styled('div')({
  marginTop: '8px',
  fontSize: '16px',
  color: '#9aa5b1',
});

// Create Course button styling
const CreateCourseButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#5f71ea',
  color: 'white',
  marginTop: '20px',
  '&:hover': {
    backgroundColor: '#4a5bcb',
    opacity: 0.9,
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

// Chart container styling
const VerticalLineChart = styled(Chart)({
  backgroundColor: '#1b2532',
  padding: '12px',
  borderRadius: '8px',
  width: '100%',
  maxWidth: '1600px',
  boxSizing: 'border-box',
  marginBottom: '20px',
});

const TutorDashboard = () => {
  const chartOptions: ApexOptions = {
    chart: {
      id: 'vertical-line-chart',
      type: 'line',
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    },
    colors: ['#5f71ea'],
  };

  const chartSeries = [
    {
      name: 'Total Earnings',
      data: [3000, 4000, 3500, 5000, 6000, 7000, 8000],
    },
  ];

  return (
    <DashboardContainer>
      <StatsContainer>
        <StatItem>
          <StatLabel>Total earnings</StatLabel>
          <StatValue>$17,450</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Total courses</StatLabel>
          <StatValue>1</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Total students</StatLabel>
          <StatValue>10</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Enrolled students</StatLabel>
          <StatValue>10</StatValue>
        </StatItem>
      </StatsContainer>

      <VerticalLineChart
        options={chartOptions}
        series={chartSeries}
        type="line"
        height={300}
      />

      <CreateCourseButton variant="contained">Create Course</CreateCourseButton>
    </DashboardContainer>
  );
};

export default TutorDashboard;
