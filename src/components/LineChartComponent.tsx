"use client";

import { useState } from "react";
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
import { Card, Col, Container, Row } from "react-bootstrap";
import { Word, WordCloud } from "@prisma/client";

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

export default function LineChartComp({wordclouds, words}: {wordclouds?: WordCloud[], words?: Word[][]}) {
  const [wcOrder, setWCOrder] = useState([0,1,2])
  const [searchWords, setSearchWords] = useState('')
  // 2. Single source of truth for both the table and the graph
  const [rows, setRows] = useState([
    { wordCloudTitle: "wc1=================", wordValue: 4200 },
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
    <Container className="my-4">
      <Row className="g-4 justify-content-center d-flex">
        <Col className="md">
          <Card id="darkcard1" className="h-100">
            <Card.Header className="fw-bold text-center">Word Count Trends</Card.Header>
            <Card.Body style={{ minHeight: "400px" }}>
              <Line data={chartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
