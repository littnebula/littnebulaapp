'use client';
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { WordCloud, Word } from "@prisma/client";
import WordCloudVisualizer from "./WordCloudVisualizer";
import { getFormattedData } from "@/lib/WordCloudActions";
import { useState } from 'react';
import Link from "next/link";
import { PencilSquare, Bookmark, BookmarkCheckFill } from 'react-bootstrap-icons';

const WordCloudExaminer = ({wordclouddata, words, canEdit}: {wordclouddata: WordCloud, words: Word[], canEdit: boolean}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const collapsedRowsCount: number = 5;
  const firstfiveRows = isExpanded ? words : words.slice(0, collapsedRowsCount);
  const hasmoreRows = words.length > collapsedRowsCount;
  return (
    <Container fluid className="py-3">
      <Row>
        <Col>
          <h1 className="text-wrap text-break">{wordclouddata.title}</h1>
          <h4>Created by {wordclouddata.owner}</h4>
          <h6>({wordclouddata.createdAt.toLocaleDateString('en-US')})</h6>
          <h6 className="text-wrap text-break">[{wordclouddata.tags.join('] [')}]</h6>
        </Col>
        
        <Col className="justify-content-end">
          {canEdit && (
            <Link 
              key={wordclouddata.title} 
              href={`/edit/${wordclouddata.id}`}
              className='btn btn-solid-grn'
            >
              <PencilSquare/> Edit
            </Link>
          )}
          <Button></Button>
        </Col>
      </Row>
      <Row>          
        <WordCloudVisualizer 
        FormattedWordCloudData={getFormattedData(words, wordclouddata.displayCount)}
        sizing={1.0}/>
      </Row>
      <Row>
        <Card id="darkcard1" className="my-1">
          <Row>
            <Col>
              <p>{wordclouddata.views} Views</p>
            </Col>
            <Col>
              <p>{wordclouddata.bookmarks} Bookmarks</p>
            </Col>
          </Row>
        </Card>
      </Row>
      <Row>
        <Card id="darkcard1">
          <h4>Description: </h4>
          <p className="text-wrap text-break">{wordclouddata.description}</p>
          <hr/>
          <h4>Bibliography</h4>
          <p className="text-wrap text-break">{wordclouddata.bibliography}</p>
        </Card>
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
