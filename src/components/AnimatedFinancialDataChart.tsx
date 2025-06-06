import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Example data structure
interface DataPoint {
  name: string; // e.g., 'Jan', 'Feb', 'Mar'
  value: number;
  // optional additional values for multi-line charts
  value2?: number;
}

interface AnimatedFinancialDataChartProps {
  data: DataPoint[];
  title?: string;
  lineColor?: string;
  areaColor?: string;
  showArea?: boolean;
}

const AnimatedFinancialDataChart: React.FC<AnimatedFinancialDataChartProps> = ({
  data,
  title = "Financial Overview",
  lineColor = "#8884d8", // Default Recharts line color
  areaColor = "#8884d8", // Default Recharts area color
  showArea = false,
}) => {
  console.log("Rendering AnimatedFinancialDataChart with data points:", data.length);

  // Memoize chart data to prevent unnecessary re-renders if data prop doesn't change
  const chartData = useMemo(() => data, [data]);

  if (!chartData || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available to display.</p>
        </CardContent>
      </Card>
    );
  }

  const ChartComponent = showArea ? AreaChart : LineChart;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ChartComponent
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
            />
            <Legend />
            {showArea ? (
              <Area type="monotone" dataKey="value" stroke={lineColor} fillOpacity={0.3} fill={areaColor} activeDot={{ r: 8 }} animationDuration={500}/>
            ) : (
              <Line type="monotone" dataKey="value" stroke={lineColor} activeDot={{ r: 8 }} animationDuration={500} />
            )}
            {/* Example for a second line/area if value2 exists */}
            {chartData[0]?.value2 !== undefined && (
              showArea ? (
                <Area type="monotone" dataKey="value2" stroke="#82ca9d" fillOpacity={0.3} fill="#82ca9d" animationDuration={500} />
              ) : (
                <Line type="monotone" dataKey="value2" stroke="#82ca9d" animationDuration={500} />
              )
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
export default AnimatedFinancialDataChart;