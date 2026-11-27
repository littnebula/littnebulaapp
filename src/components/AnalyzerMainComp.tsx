'use client';

import { Collection, Comment, Word, WordCloud } from "@prisma/client";
import { Card, Col, Container, Nav, Row, TabContainer, TabContent, TabPane } from "react-bootstrap";
import WordCloudVisualizer from "./WordCloudVisualizer";
import { getFormattedData } from "@/lib/WordCloudActions";
import AddCommentForm from "./AddCommentForm";
import CommentItem from "./CommentItem";

const AnalyzerMainComponent = ({ 
    collData, 
    wordclouds, 
    words,
    comments
    }: { 
    collData: Collection, 
    wordclouds: WordCloud[] 
    words: Word[][]
    comments: Comment[]
  }) => {
  const alltags: string[] = [];
  let avgDisplayCount: number = 0;
  wordclouds.forEach(wc => {
    alltags.push(...wc.tags);
    avgDisplayCount += wc.displayCount;
  });
  avgDisplayCount /= wordclouds.length;
  const mergedwordSet: Word[] = [];
  words.forEach((wordset) => {
    mergedwordSet.push(...wordset)
  })

  const leftwordset: Word[] = [];
  leftwordset.push(...words[0]);
  const rightwordset: Word[] = [];
  rightwordset.push(...words[1]);


  return (
    <Container>
      <Container style={{height: '40px'}}/>
      <Row>
        <h2>{collData.title}</h2>
        <h5>[{alltags.join('] [')}]</h5>
      </Row>
      <Card id="darkcard1" className="p-2">
        <TabContainer defaultActiveKey="merge">
          <Nav variant="pills" className="gray-pills">
            <Row>
              <Col>
                <Nav.Link eventKey="merge">Merged</Nav.Link>
              </Col>
              <Col>
                <Nav.Link eventKey="split">Split</Nav.Link>
              </Col>
              <Col>
                <Nav.Link eventKey="trends">Trends</Nav.Link>
              </Col>
            </Row>
          </Nav>
          <Row>
            <TabContent>
              <TabPane eventKey="merge">
                <WordCloudVisualizer 
                FormattedWordCloudData={getFormattedData(mergedwordSet, avgDisplayCount)}
                sizing={1.0}
                seed={0}
                viewWidth={400}
                viewHeight={400}
                color={`hsl(${collData.leftdisplayColorHue}, ${collData.leftdisplayColorSat}%, ${collData.leftdisplayColorLit}%)`}
                />
              </TabPane>
              <TabPane eventKey="split">
                <Row>
                  <Col>
                    <WordCloudVisualizer 
                    FormattedWordCloudData={getFormattedData(leftwordset, wordclouds[0].displayCount)}
                    sizing={0.4}
                    seed={12}
                    viewWidth={180}
                    viewHeight={200}
                    color={`hsl(${collData.leftdisplayColorHue}, ${collData.leftdisplayColorSat}%, ${collData.leftdisplayColorLit}%)`}
                    />
                  </Col>
                  <Col>
                    <WordCloudVisualizer 
                    FormattedWordCloudData={getFormattedData(rightwordset, wordclouds[1].displayCount)}
                    sizing={0.4}
                    seed={1}
                    viewWidth={180}
                    viewHeight={200}
                    color={`hsl(${collData.rightdisplayColorHue}, ${collData.rightdisplayColorSat}%, ${collData.rightdisplayColorLit}%)`}
                    />
                  </Col>
                </Row>
                
              </TabPane>
            </TabContent>
          </Row>
        </TabContainer>
      </Card>
      <hr/>
      <Card id="darkcard1" className="p-2">
        <TabContainer defaultActiveKey="desc">
          <Nav variant="pills" className="gray-pills">
            <Row>
              <Col>
                <Nav.Link eventKey="desc">Description</Nav.Link>
              </Col>
              <Col>
                <Nav.Link eventKey="comments">Comments</Nav.Link>
              </Col>
              <Col>
                <Nav.Link eventKey="wclinks">WordClouds</Nav.Link>
              </Col>
            </Row>
          </Nav>
          <Row>
            <TabContent>
              <TabPane eventKey="desc">
                <Container className="p-2">
                  <p>{collData.description}</p>
                </Container>
              </TabPane>
              <TabPane eventKey='comments'>
                <AddCommentForm collid={collData.id}/>
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
      <Container style={{height: '200px'}}>

      </Container>
    </Container>
  )
}

export default AnalyzerMainComponent;
