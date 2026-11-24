'use client';

import { WordCloud } from "@prisma/client";
import Link from "next/link";
import { Card, Col, Container, Nav, Row, TabContainer, TabContent, TabPane } from "react-bootstrap";
import { truncateString } from "./WordcloudViewingLink";
import WordCloudCard from "@/components/WordCloudCard";

const UserDashboard = ({ownedwc, bookmarkedwc, recentwc}: {ownedwc: WordCloud[], bookmarkedwc: WordCloud[], recentwc: WordCloud[]}) => {
  return (
    <TabContainer defaultActiveKey="owned">
    <Container fluid>
    <Row className="vh-100">
        <Col className="col-4 d-flex justify-content-center">
            <Card id="darkcard1" className="p-4">
                <Nav variant="pills" className="gray-pills">
                <Container>
                    <h2>My Dashboard</h2>
                </Container>
                <Container className='d-flex justify-content-center'>
                    <Link
                        href='/add'
                        className="btn btn-primary btn-lg my-2"
                        style={{
                            backgroundColor: 'rgba(0, 65, 130, 0.9)',
                            border: '1px solid #004182',
                        }}
                    >
                    Embark on New Voyage
                    </Link>
                </Container>
                <Container>
                    <Nav.Link eventKey="owned">Owned Territories</Nav.Link>
                </Container>
                <Container>
                    <Nav.Link eventKey="bookmarked">Marked Territories</Nav.Link>
                </Container>
                {/* <Nav.Link eventKey="shared">Shard Territories</Nav.Link> */}
                <Container>
                    <Nav.Link eventKey="recent">Recent Territories</Nav.Link>
                </Container>
                </Nav>
            </Card>
        </Col>
        <Col className="d-flex justify-content-center">
            <Card id="darkcard1" className="p-4 w-100">
            <TabContent>
            <TabPane eventKey="owned">
                <Row>
                {ownedwc.map((wordcloud) => (
                    <Col md={6} lg={4} key={wordcloud.id} className="mb-3">
                    <WordCloudCard
                        id={wordcloud.id}
                        title={truncateString(wordcloud.title, 32)}
                        description={truncateString(wordcloud.description, 32)}
                        owner={wordcloud.owner}
                        views={wordcloud.views}
                        tags={wordcloud.tags}
                    />
                    </Col>
                ))}
                </Row>
            </TabPane>
            <TabPane eventKey="bookmarked">
                <Row>
                {bookmarkedwc.map((wordcloud) => (
                    <Col md={6} lg={4} key={wordcloud.id} className="mb-3">
                    <WordCloudCard
                        id={wordcloud.id}
                        title={truncateString(wordcloud.title, 32)}
                        description={truncateString(wordcloud.description, 32)}
                        owner={wordcloud.owner}
                        views={wordcloud.views}
                        tags={wordcloud.tags}
                    />
                    </Col>
                ))}
                </Row>
            </TabPane>
            <TabPane eventKey="recent">
                <Row>
                {recentwc.map((wordcloud) => (
                    <Col md={6} lg={4} key={wordcloud.id} className="mb-3">
                    <WordCloudCard
                        id={wordcloud.id}
                        title={truncateString(wordcloud.title, 32)}
                        description={truncateString(wordcloud.description, 32)}
                        owner={wordcloud.owner}
                        views={wordcloud.views}
                        tags={wordcloud.tags}
                    />
                    </Col>
                ))}
                </Row>
            </TabPane>
            </TabContent>
            </Card>
        </Col>
    </Row>
    </Container>
    </TabContainer>
  ) 
}

export default UserDashboard;
