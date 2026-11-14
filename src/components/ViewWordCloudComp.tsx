'use client';
import { Col, Container, Row, Table } from "react-bootstrap";
import { WordCloud, Word } from "@prisma/client";
import WordCloudVisualizer from "./WordCloudVisualizer";
import { getFormattedData } from "@/lib/WordCloudActions";
import React, { useState } from 'react';

const WordCloudExaminer = ({wordclouddata, words}: {wordclouddata: WordCloud, words: Word[]}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const collapsedRowsCount: number = 5;
  const firstfiveRows = isExpanded ? words : words.slice(0, collapsedRowsCount);
  const hasmoreRows = words.length > collapsedRowsCount;
  return (
    <Container fluid className="py-3">
      <Row>
          <h1 className="text-wrap text-break">{wordclouddata.title}</h1>
          <h4>Created by {wordclouddata.owner}</h4>
          <h6>[{wordclouddata.createdAt.toLocaleDateString('en-US')}]</h6>
        </Row>
        <Row>          
          <WordCloudVisualizer 
          FormattedWordCloudData={getFormattedData(words, wordclouddata.displayCount)}
          sizing={1.0}/>
        </Row>
        <Row>
          <Col>
            <p className="text-wrap text-break">{wordclouddata.description}</p>
          </Col>
        </Row>
        <Row>
          <Col sm>
            <hr/>
            <p className="text-wrap text-break">{wordclouddata.bibliography}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2 className="text-wrap text-break">All Words for: {wordclouddata.title} </h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Unique Word</th>
                  <th className="text-start">Count</th>
                  <th className="text-start">Annotation</th>
                </tr>
              </thead>
              <tbody>
                {firstfiveRows.map((w) => (
                  <tr key={w.text}>
                    <td>{w.text}</td>
                    <td className="text-start">{w.value}</td>
                    <td className="text-start">{w.annotation}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {hasmoreRows && (
              <button
                type="button"
                onClick={() => setIsExpanded((toggle) => !toggle)}
                aria-expanded={isExpanded}
              >
                {isExpanded
                ? 'Show Less'
                : `Show All (${words.length - collapsedRowsCount} more)`}
              </button>
            )}
          </Col>
        </Row>
    </Container>
  )
  
};

export default WordCloudExaminer;
