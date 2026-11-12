// import { Stuff } from '@prisma/client';
// import Link from 'next/link';

import { Container } from "react-bootstrap";
import React from "react";
import { Word, WordCloud } from "@isoterik/react-word-cloud";


/* Renders a single row in the List Stuff table. See list/page.tsx. */
const WordCloudVisualizer = ({FormattedWordCloudData}: {FormattedWordCloudData: Word[]}) => {
  console.log(`passed data: ${JSON.stringify(FormattedWordCloudData, null, 2)}`)
  return (
    <Container className="justify-content-center">
      <div style={{ width: "600px", height: "600px" }}>
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
