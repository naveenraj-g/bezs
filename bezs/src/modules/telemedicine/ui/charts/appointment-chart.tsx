"use client";

import { Card } from "@/components/ui/card";
import { AppointmentChartProps } from "../../types/data-types";

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Legend,
  Bar,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DataProps {
  data: AppointmentChartProps;
}

export const AppoinmentChart = ({ data }: DataProps) => {
  return (
    <Card className="rounded-xl p-4 h-full gap-0">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Appointments</h1>
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart width={100} height={300} data={data} barSize={25}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#9ca3af" }}
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ fill: "#9ca3af" }} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "#fff" }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{
              paddingTop: "20px",
              paddingBottom: "40px",
              textTransform: "capitalize",
            }}
          />
          <Bar
            dataKey="appointment"
            fill="#000000"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="completed"
            fill="#2563eb"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
