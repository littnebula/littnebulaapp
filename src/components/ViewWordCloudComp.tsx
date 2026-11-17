'use client';
import { Card, Col, Container, Nav, Row, TabContainer, TabContent, Table, TabPane } from "react-bootstrap";
import { WordCloud, Word, Comment } from "@prisma/client";
import WordCloudVisualizer from "./WordCloudVisualizer";
import { getFormattedData } from "@/lib/WordCloudActions";
import { useState } from 'react';
import AddCommentForm from "./AddCommentForm";
import CommentItem from "./CommentItem";

const WordCloudExaminer = ({wordclouddata, words, comments}: {wordclouddata: WordCloud, words: Word[], comments: Comment[]}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const collapsedRowsCount: number = 5;
  const firstfiveRows = isExpanded ? words : words.slice(0, collapsedRowsCount);
  const hasmoreRows = words.length > collapsedRowsCount;
  return (
    <Container fluid className="py-3">
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
          <TabContainer defaultActiveKey="first">
            <Nav variant="pills">
              <Row>
                <Col>
                  <Nav.Link eventKey="desc">Description</Nav.Link>
                </Col>
                <Col>
                  <Nav.Link eventKey="bib">Bibliography</Nav.Link>
                </Col>
                <Col>
                  <Nav.Link eventKey="wordlist">Word List</Nav.Link>
                </Col>
                <Col>
                  <Nav.Link eventKey="comments">Comments</Nav.Link>
                </Col>
              </Row>
            </Nav>
            <Row>
              <TabContent>
                <TabPane eventKey="desc">
                  <p className="text-wrap text-break">{wordclouddata.description}</p>
                </TabPane>
                <TabPane eventKey="bib">
                  <p className="text-wrap text-break">{wordclouddata.bibliography}</p>
                </TabPane>
                <TabPane eventKey="wordlist">
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

                </TabPane>
                <TabPane eventKey="comments">
                  <AddCommentForm wcid={wordclouddata.id}/>
                  {comments.map((entry) => (
                    <Container key={entry.id}>
                      <hr/>
                      <CommentItem comment={entry}/>
                    </Container>
                  ))}
                </TabPane>
              </TabContent>
            </Row>
          </TabContainer>
        </Card>
      </Row>
    </Container>
  )
};

export default WordCloudExaminer;
