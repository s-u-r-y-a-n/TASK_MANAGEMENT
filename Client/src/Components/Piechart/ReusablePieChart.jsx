import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./ReusablePieChart.scss";

const DEFAULT_COLORS = [
  "#2563eb", // Primary blue
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#0f766e", // Secondary teal
  "#06b6d4", // Cyan
];

// Custom polished tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="pie-custom-tooltip">
        <div
          className="tooltip-color-indicator"
          style={{ backgroundColor: data.payload.fill }}
        />
        <span className="tooltip-label">{data.name}:</span>
        <span className="tooltip-value">{data.value}</span>
      </div>
    );
  }
  return null;
};

export const ReusablePieChart = ({
  data = [],
  nameKey = "name",
  dataKey = "value",
  title = "",
  innerRadius = 55, // Set to 0 for a solid Pie chart, > 0 for a Doughnut
  outerRadius = 80,
  colors = DEFAULT_COLORS,
  height = 300,
  showLegend = true,
}) => {
  const hasData =
    Array.isArray(data) &&
    data.length > 0 &&
    data.some((item) => item[dataKey] > 0);

  return (
    <div className="reusable-pie-chart-card">
      {title && <h3 className="chart-title">{title}</h3>}

      <div className="chart-wrapper" style={{ height }}>
        {!hasData ? (
          <div className="chart-no-data">
            <p>No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                nameKey={nameKey}
                dataKey={dataKey}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={innerRadius > 0 ? 3 : 0}
                stroke="#ffffff"
                strokeWidth={2}
                isAnimationActive={true}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />

              {showLegend && (
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingTop: "12px", fontSize: "0.82rem" }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
