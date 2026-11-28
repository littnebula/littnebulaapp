'use client';
import { Collection, WordCloud } from "@prisma/client"
import Link from "next/link"
import { Card, Col, Container, Nav, Row, TabContainer, TabContent, TabPane } from "react-bootstrap"
import { truncateString } from "./WordcloudViewingLink";

const UserDashboard = ({
    ownedwc, 
    bookmarkedwc, 
    recentwc,
    ownedcoll,
    }: {
    ownedwc: WordCloud[], 
    bookmarkedwc: WordCloud[], 
    recentwc: WordCloud[],
    ownedcoll: Collection[],
  }) => {
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
                    <Link href='/add' className="btn btn-primary btn-lg my-2">
                    Embark on New Voyage
                    </Link>
                </Container>
                {(ownedwc.length > 1) && (<Container>
                    <Link href='/addCollection' className="btn btn-primary btn-lg my-2">
                    Organize a New Cluster
                    </Link>
                </Container>)}
                
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
                <Container>
                    <Nav.Link eventKey="ownedcollections">Owned Clusters</Nav.Link>
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
                    <Link
                        href={`/examine/${wordcloud.id}`}
                        className='text-decoration-none text-reset'
                    >
                    <Card className="h-100">
                        <div className="card-body">
                        <h5 className="card-title">{truncateString(wordcloud.title, 32)}</h5>
                        <p className="card-text">{truncateString(wordcloud.description, 32)}</p>
                        </div>
                    </Card>
                    </Link>
                    </Col>
                ))}
                </Row>
            </TabPane>
            <TabPane eventKey="bookmarked">
                <Row>
                {bookmarkedwc.map((wordcloud) => (
                    <Col md={6} lg={4} key={wordcloud.id} className="mb-3">
                    <Link
                        href={`/examine/${wordcloud.id}`}
                        className='text-decoration-none text-reset'
                    >
                    <Card className="h-100">
                        <div className="card-body">
                        <h5 className="card-title">{truncateString(wordcloud.title, 32)}</h5>
                        <p className="card-text">{truncateString(wordcloud.description, 32)}</p>
                        </div>
                    </Card>
                    </Link>
                    </Col>
                ))}
                </Row>
            </TabPane>
            <TabPane eventKey="recent">
                <Row>
                {recentwc.map((wordcloud) => (
                    <Col md={6} lg={4} key={wordcloud.id} className="mb-3">
                    <Link
                        href={`/examine/${wordcloud.id}`}
                        className='text-decoration-none text-reset'
                    >
                    <Card className="h-100">
                        <div className="card-body">
                        <h5 className="card-title">{truncateString(wordcloud.title, 32)}</h5>
                        <p className="card-text">{truncateString(wordcloud.description, 32)}</p>
                        </div>
                    </Card>
                    </Link>
                    </Col>
                ))}
                </Row>
            </TabPane>
            <TabPane eventKey="ownedcollections">
                <Row>
                {ownedcoll.map((collection) => (
                    <Col md={6} lg={4} key={collection.id} className="mb-3">
                    <Link
                        href={`/analyze/${collection.id}`}
                        className='text-decoration-none text-reset'
                    >
                    <Card className="h-100">
                        <div className="card-body">
                        <h5 className="card-title">{truncateString(collection.title, 32)}</h5>
                        <p className="card-text">{truncateString(collection.description, 32)}</p>
                        </div>
                    </Card>
                    </Link>
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
