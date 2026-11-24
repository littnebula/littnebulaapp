'use client';
import { Card, Col, Container, Nav, Row, TabContainer, TabContent, TabPane } from "react-bootstrap";
import { WordCloud, Word, Comment } from "@prisma/client";
import WordCloudVisualizer from "./WordCloudVisualizer";
import { getFormattedData } from "@/lib/WordCloudActions";
import AddCommentForm from "./AddCommentForm";
import CommentItem from "./CommentItem";
import WordListing from "./ListWordsFromCloud";

const WordCloudExaminer = ({wordclouddata, words, comments}: {wordclouddata: WordCloud, words: Word[], comments: Comment[]}) => {
  return (
    <Container fluid className="py-3">
      <Row>          
        <WordCloudVisualizer 
        FormattedWordCloudData={getFormattedData(words, wordclouddata.displayCount)}
        sizing={1.0}
        seed={0}/>
      </Row>
      <Row>
        <Card id="darkcard1" className="my-1">
          <Row>
            <Col>
              <p className="fs-4">{wordclouddata.views} Views</p>
            </Col>
            <Col>
              <p className="fs-4">{wordclouddata.bookmarks} Bookmarks</p>
            </Col>
          </Row>
        </Card>
      </Row>
      <Row>
        <Card id="darkcard1" className="p-2">
          <TabContainer defaultActiveKey="desc">
            <Nav variant="pills" className="gray-pills">
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
                  <WordListing words={words} />
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
