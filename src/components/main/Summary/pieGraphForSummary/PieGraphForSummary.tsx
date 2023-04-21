import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { AnalyzedMessage } from "../../Main";

let data = [
  { name: "A", value: 400 },
  { name: "B", value: 300 },
  { name: "C", value: 300 },
  { name: "D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PieChartExample = () => {
  const results = useSelector((state: { analyzedMessagesSlice: AnalyzedMessage[] }) => state.analyzedMessagesSlice);

  const names = results.map((result: any) => result.map((data: any) => data[0].speaker));
  console.log(names, "names");

  useEffect(() => {
    console.log(results, "results");
  }, [results]);

  return (
    <PieChart width={400} height={400}>
      <Pie data={data} cx={200} cy={200} innerRadius={0} outerRadius={100} dataKey="value" labelLine label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend layout="horizontal" />
    </PieChart>
  );
};

export default PieChartExample;
