'use client';
import { Container } from "react-bootstrap";
import { Word, WordCloud } from "@isoterik/react-word-cloud";


/* Renders a single row in the List Stuff table. See list/page.tsx. */
const WordCloudVisualizer = ({FormattedWordCloudData}: {FormattedWordCloudData: Word[]}) => {
  // console.log(`passed data: ${JSON.stringify(FormattedWordCloudData, null, 2)}`)
  return (
    <Container className="justify-content-center">
      <div style={{
        width: "400px",
        height: "400px",
        margin: "auto"
      }}>
        <WordCloud
          words={FormattedWordCloudData}
          width={100}
          height={100}
          rotate={() => 0}
          fill={'white'}
          random={() => 0}
        />
      </div>
    </Container>
  );
};

export default WordCloudVisualizer;
