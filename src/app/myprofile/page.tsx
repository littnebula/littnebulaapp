import { Card, Col, Container, Row, } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import WordCloudViewLink from '@/components/WordcloudViewingLink';

/** Render a list of stuff for the logged in user. */
const ListPage = async () => {
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  const owner = (session && session.user && session.user.email) || '';
  const ownedwc = await prisma.wordCloud.findMany({
    where: {
      owner,
    },
  });
  return (
    <main>
      <Container id="list" fluid className="py-3">
        <Row>
          <Col>
            <Card id="darkcard1">
              <h1 className='m-auto'>Controlled Territories</h1>
              <Container className='d-flex justify-content-center'>
                <Link href='/add' className="btn btn-primary btn-lg my-2">
                  Embark on New Voyage
                </Link>
              </Container>
            
              <h1 className='m-auto'>My Voyages</h1>
              <hr/>
              {ownedwc.map((wc) => (
                <WordCloudViewLink key={wc.title} wc={wc} />
              ))}
            </Card>
          </Col>
          <Col>
            <Card id='darkcard1'>
              <h1 className='m-auto'>Recently Explored</h1>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ListPage;
