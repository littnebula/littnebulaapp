import { Col, Container, Row, Table } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
// import StuffItem from '@/components/StuffItem';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import WordCloudVisualizer from '@/components/WordCloudVisualizer';
import { getFormattedData } from '@/lib/WordCloudActions';
import { Word } from '@prisma/client';

/** Render a list of stuff for the logged in user. */
const DBGViewPage = async () => {
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  const owner = (session && session.user && session.user.email) || '';
  const wordcloud = await prisma.wordCloud.findFirst({
    where: {
      owner,
    },
  });
  const wordcloudId = wordcloud?.id;
  const words: Word[] = await prisma.word.findMany({
    where: {
      wordcloudId
    }
  });
  const displayCount: number = wordcloud?.displayCount || 10;
  return (
    <main>
      <Container id="list" fluid className="py-3">
        <Row>          
          <WordCloudVisualizer FormattedWordCloudData={getFormattedData(words, displayCount)}/>
        </Row>
        <Row>
          <Col>
            <h1>Words Set</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Unique Word</th>
                  <th>Count</th>
                  <th>Annotation</th>
                </tr>
              </thead>
              <tbody>
                {words.map((w) => (
                  <tr key={w.text}>
                    <td>{w.text}</td>
                    <td>{w.value}</td>
                    <td>{w.annotation}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default DBGViewPage;
