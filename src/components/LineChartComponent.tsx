"use client";

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

// 1. Define TypeScript interface for your table rows
// interface WordTrack {
//   wordCloudTitle: string;
//   wordValue: number;
// }

export default function LineChartComp({
  searchWords, 
  wordclouds, 
  words
  }: {
  searchWords: string[]
  wordclouds?: WordCloud[], 
  words?: Word[][]
  }) {
  if (!wordclouds || !words) {
    return (<></>);
  }
  type WordCloudData = Record<string, string | number>;

  const data: WordCloudData[] = [];

  wordclouds?.forEach((wc, idx) => {
    // 3. Type 'newEntry' so TypeScript accepts dynamic keys from searchWords
    const newEntry: WordCloudData = { title: wc.title };

    searchWords.forEach((key) => {
      newEntry[key] = words[idx].reduce((sum, item) => {
        return item.text === key ? sum + item.value : sum;
      }, 0);
    });
    data.push(newEntry);
  })

  // 3. Map the table rows into Chart.js format
  const chartData: ChartData<"line"> = {
    labels: data.map((row) => row.title),
    datasets: [],
  };
  console.log(data);
  searchWords.forEach((key, idx) => {
    chartData.datasets.push({
        label: key,
        data: data.map((row) => +row[key]),
        borderColor: `hsla(${idx * 360/searchWords.length}, ${100}%, ${50}%)`,
        backgroundColor: `hsla(${idx * 360/searchWords.length}, ${100}%, ${50}%)`,
        tension: 0.3,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
      })
  })
  console.log(chartData.datasets);

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "top",
        labels: {
          color: "#ffffff",
          font: {
            size: 16,
          },
        },
      },
      tooltip: {
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 14,
        },
      },
    },
    scales: {
      // 4. X-Axis Ticks & Title
      x: {
        ticks: {
          color: "#ffffff",
          font: {
            size: 14,
          },
        },
        grid: {
          color: "#ffffff75",
        },
        title: {
          display: true,
          text: "Territories",
          color: "#ffffff",
          font: {
            size: 14,
          },
        },
      },
      // 5. Y-Axis Ticks & Title
      y: {
        ticks: {
          color: "#ffffff",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "#ffffff7c",
        },
        title: {
          display: true,
          text: "Word Counts",
          color: "#ffffff",
          font: {
            size: 14,
          },
        },
      },
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
