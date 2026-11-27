import { Container, Row} from "react-bootstrap";
import { prisma } from "@/lib/prisma";
import AnalyzerMainComponent from "@/components/AnalyzerMainComp";
import { Word } from "@prisma/client";
import LineChartComp from "@/components/LineChartComponent";
import DragDropBoxes, { Item } from "@/components/draganddropdemo";
import SplitComparator from "@/components/SplitComparatorComp";


export default async function DebuggingSpace() {
  const collectiondata = await prisma.collection.findUnique({
    where: { id: 1},
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

  const STARTING_ITEMS: Item[] = [];
  wordclouds.forEach((wc, idx) => {
    STARTING_ITEMS.push({ id: `${idx}`, label: wc.title, location: 'pool'})
  })

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
        <LineChartComp />
      </Row>
      <Row>
        <SplitComparator 
        collData={collection}
        wordclouds={wordclouds}
        allwords={words}/>
      </Row>
    </Container>
  );
};

