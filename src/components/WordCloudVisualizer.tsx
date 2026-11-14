'use client';
import { Container } from "react-bootstrap";
import { WordCloud } from "@isoterik/react-word-cloud";
import { Word } from "@prisma/client";

/* Renders a single row in the List Stuff table. See list/page.tsx. */
const WordCloudVisualizer = ({FormattedWordCloudData}: {FormattedWordCloudData: Word[]}) => {
  // console.log(`passed data: ${JSON.stringify(FormattedWordCloudData, null, 2)}`)
  return (
    <Container>
      <div style={{
        width: "500px",
        height: "500px",
        margin: "auto"
      }}>
        <WordCloud
          words={FormattedWordCloudData}
          width={200}
          height={200}
          rotate={() => 0}
          fill={'white'}
          random={() => 0}
        />
      </div>
    </Container>
  );
};

export default WordCloudVisualizer;
