import { prisma } from "@/lib/prisma";
import { VisibilityType } from "@prisma/client";
import { Col, Container, Row } from "react-bootstrap";
import WordCloudViewLink from "./WordcloudViewingLink";

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
        {newestWordclouds.map((wc) => (
        <WordCloudViewLink key={wc.title} wc={wc}/>
        ))}
      </Col>
      <Col className="w-50">
        {popularWorclouds.map((wc) => (
        <WordCloudViewLink key={wc.title} wc={wc} />
        ))}
      </Col>
    </Row>
    
  </Container>
)};

export default LandingPageListing;
