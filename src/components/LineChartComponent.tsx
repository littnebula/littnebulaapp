"use client";

import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register required Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// // 1. Define TypeScript interface for your table rows
// interface WordTrack {
//   wordCloudTitle: string;
//   wordValue: number;
// }

export default function LineChartComp() {
  // 2. Single source of truth for both the table and the graph
  const [rows, setRows] = useState([
    { wordCloudTitle: "wc1", wordValue: 4200 },
    { wordCloudTitle: "wc2", wordValue: 5100 },
    { wordCloudTitle: "wc3", wordValue: 7400 },
    { wordCloudTitle: "wc4", wordValue: 4800 },
    { wordCloudTitle: "wc5", wordValue: 6300 },
  ]);

  // 3. Map the table rows into Chart.js format
  const chartData: ChartData<"line"> = {
    labels: rows.map((row) => row.wordCloudTitle),
    datasets: [
      {
        label: "Data",
        data: rows.map((row) => row.wordValue),
        borderColor: `hsla(${120}, ${100}%, ${50}%)`, // Bootstrap primary blue
        backgroundColor: `hsla(${120}, ${100}%, ${50}%)`,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
  };

  return (
    <div className="container my-4">
      <div className="row g-4 justify-content-center d-flex">

        {/* Line Graph */}
        <div className="col-md-10">
          <div id="darkcard1" className="card h-100">
            <div className="card-header fw-bold">Word Count Trends</div>
            <div className="card-body" style={{ minHeight: "400px" }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
