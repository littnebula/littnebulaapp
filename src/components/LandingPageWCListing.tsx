import { prisma } from "@/lib/prisma";
import { VisibilityType } from "@prisma/client";
import { Card, Col, Container, Row } from "react-bootstrap";
import Link from "next/link";


function truncateString(str: string, limit: number) {
  if (str.length > limit) {
    return str.slice(0, limit-2) +"...";
  }
  return str
}

const LandingPageListing = async () => {
  const newestWordclouds = await prisma.wordCloud.findMany({
    where: {
        visibility: VisibilityType.PUBLIC
    },
    orderBy: {
        createdAt: 'desc'
    },
    take: 10,
  });
  const popularWorclouds = await prisma.wordCloud.findMany({
    where: {
        visibility: VisibilityType.PUBLIC
    },
    orderBy: {
        bookmarks: "desc"
    },
    take: 10,
  })
  return (
  <Container className="container-fluid d-flex flex-column">
    <Row className="g-0">
      <Col className="text-center">
        <h3>Recent Territories</h3>    
      </Col>
      <Col className="text-center">
        <h3>Popular Territories</h3>    
      </Col>
    </Row>
    <Row>
      <Col className="w-50">
        {newestWordclouds.map((wordcloud) => (
          <Link
            key={wordcloud.id}
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
        ))}
      </Col>
      <Col className="w-50">
        {popularWorclouds.map((wordcloud) => (
          <Link
            key={wordcloud.id}
            href={`/examine/${wordcloud.id}`}
            className='text-decoration-none text-reset d-block'
          >
          <Card className="w-100 h-100">
            <div className="card-body">
            <h5 className="card-title">{truncateString(wordcloud.title, 32)}</h5>
            <p className="card-text">{truncateString(wordcloud.description, 32)}</p>
            </div>
          </Card>
          </Link>
        ))}
      </Col>
    </Row>
  </Container>
)};

export default LandingPageListing;
