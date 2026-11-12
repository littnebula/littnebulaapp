// import { Stuff } from '@prisma/client';
// import Link from 'next/link';

import { Container } from "react-bootstrap";

interface wcd {
    wordcloud: object,
    totalwords: number,
}

/* Renders a single row in the List Stuff table. See list/page.tsx. */
const WordCloudVisualizer = ({ wordclouddata, total }: { wordclouddata: object, total: number }) => {
  console.log(`passed data: ${JSON.stringify(wordclouddata, null, 2)}`)
  return (
    <Container>
        
    </Container>
  );
};

export default WordCloudVisualizer;
