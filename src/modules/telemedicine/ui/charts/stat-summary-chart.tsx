/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { formatNumber } from "@/utils";
import { Users } from "lucide-react";
import Link from "next/link";
import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";

export const StatSummaryChart = ({
  data,
  total,
}: {
  data: any;
  total: number;
}) => {
  const dataInfo = [
    {
      name: "Total",
      count: total || 0,
      fill: "white",
    },
    {
      name: "Appointments",
      count: data?.PENDING + data?.SCHEDULED || 0,
      fill: "#000",
    },
    {
      name: "Consultations",
      count: data?.COMPLETED || 0,
      fill: "#2563eb",
    },
  ];

  const appointment = dataInfo[1].count;
  const consultation = dataInfo[2].count;

  return (
    <div className="rounded-xl w-full h-full">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <h1 className="text-lg font-semibold">Summary</h1>

        <Button
          asChild
          size="sm"
          variant="outline"
          className="font-normal text-xs bg-transparent p-2 h-0 hover:underline border-0 shadow-none hover:bg-transparent"
        >
          <Link href="/bezs/tele-medicine/patient/record/appointments">
            See details
          </Link>
        </Button>
      </div>

      <div className="relative w-full h-[75%]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={dataInfo}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>

        <Users
          size={30}
          className="absolute size-[16px] xxs:size-[30px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>

      <div className="flex justify-center flex-wrap md:flex-nowrap gap-4 xs:gap-16">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#000000] rounded-xl" />
            <h1 className="font-bold">{formatNumber(appointment)}</h1>
          </div>
          <h2 className="text-xs text-gray-400">
            {dataInfo[1].name}(
            {((appointment / (appointment + consultation)) * 100).toFixed(0)})
          </h2>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#2563eb] rounded-xl" />
            <h1 className="font-bold">{formatNumber(consultation)}</h1>
          </div>

          <h2 className="text-xs text-gray-400">
            {dataInfo[2].name}(
            {((consultation / (appointment + consultation)) * 100).toFixed(0)})
          </h2>
        </div>
      </div>
    </div>
  );
};
