// import { Stuff } from '@prisma/client';
// import Link from 'next/link';

import { Container } from "react-bootstrap";

/* Renders a single row in the List Stuff table. See list/page.tsx. */
const WordCloudVisualizer = ({ wordclouddata }: { wordclouddata: object }) => {
  console.log(`passed data: ${JSON.stringify(wordclouddata, null, 2)}`)
  return (
    <Container>

    </Container>
  );
};

export default WordCloudVisualizer;
