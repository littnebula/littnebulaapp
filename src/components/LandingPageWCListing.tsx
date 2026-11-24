import { prisma } from "@/lib/prisma";
import { VisibilityType } from "@prisma/client";
import { Col, Container, Row } from "react-bootstrap";
import WordCloudCard from "@/components/WordCloudCard";


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
    include: {
        creator: {
            select: {
                email: true
            }
        }
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
    include: {
        creator: {
            select: {
                email: true
            }
        }
    },
    orderBy: {
        bookmarks: "desc"
    },
    take: 10,
  });

  return (
    <Container className="container-fluid d-flex flex-column">
      <Row className="justify-content-evenly">
        <Col xs={12} md={5}>
          <h3 className="text-center">Recent Territories</h3>
          {newestWordclouds.map((wordcloud) => (
            <div key={wordcloud.id} className="py-1 mx-auto" style={{ width: '100%', maxWidth: '400px' }}>
              <WordCloudCard
                id={wordcloud.id}
                title={truncateString(wordcloud.title, 32)}
                description={truncateString(wordcloud.description, 32)}
                owner={wordcloud.creator.email}
                views={wordcloud.views}
                tags={wordcloud.tags}
              />
            </div>
          ))}
        </Col>

        <Col xs={12} md={5}>
          <h3 className="text-center">Popular Territories</h3>
          {popularWorclouds.map((wordcloud) => (
            <div key={wordcloud.id} className="py-1 mx-auto" style={{ width: '100%', maxWidth: '400px' }}>
              <WordCloudCard
                id={wordcloud.id}
                title={truncateString(wordcloud.title, 32)}
                description={truncateString(wordcloud.description, 32)}
                owner={wordcloud.creator.email}
                views={wordcloud.views}
                tags={wordcloud.tags}
              />
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default LandingPageListing;
