'use client';
import { Card, Container } from "react-bootstrap";
import { WordCloud } from "@isoterik/react-word-cloud";
import { Word } from "@prisma/client";

/* Renders a single row in the List Stuff table. See list/page.tsx. */
const WordCloudVisualizer = ({FormattedWordCloudData, sizing}: {FormattedWordCloudData: Word[], sizing: number}) => {
  // console.log(`passed data: ${JSON.stringify(FormattedWordCloudData, null, 2)}`)
  return (
    <Container>
      <Card id="darkcard1">
        <div style={{
          width: "500px",
          height: "500px",
          margin: "auto"
        }}>
          <WordCloud
            words={FormattedWordCloudData}
            width={200 *sizing}
            height={200 *sizing}
            rotate={() => 0}
            fill={'white'}
            random={() => 0}
          />
        </div>
      </Card>
      
    </Container>
  );
};

export default WordCloudVisualizer;
