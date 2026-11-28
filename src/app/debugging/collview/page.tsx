import { Container, Row} from "react-bootstrap";
import { prisma } from "@/lib/prisma";
import AnalyzerMainComponent from "@/components/AnalyzerMainComp";
import { Word } from "@prisma/client";


export default async function DebuggingSpace() {
  const collectiondata = await prisma.collection.findUnique({
    where: { id: 2},
    include: {
      dataset: {
        include: {
          wordcloud: {
            include: {
              wordData: true,
            }
          }
        }
      },
      comments: true
    }
  });
  if (!collectiondata) {
    return null; // or throw new Error("Collection not found");
  }
  // console.log(collectiondata)
  const { dataset, comments, ...collection } = collectiondata;
  const wordclouds = dataset.map((item) => item.wordcloud);
  const words: Word[][] = dataset.map((item) => item.wordcloud.wordData)

  return (
    <Container>
      <Row>
        <AnalyzerMainComponent 
        collData={collection}
        wordclouds={wordclouds}
        words={words}
        comments={comments}
        />
      </Row>
      <Row>
      </Row>
    </Container>
  );
};

