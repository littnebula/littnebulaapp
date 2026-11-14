import { Card, Col, Container, Row, } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import Link from 'next/link';

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
              <Container fluid>
                <Link href='/add' className="btn btn-primary btn-lg">
                  Embark on New Voyage
                </Link>
              </Container>
             
              <h1>Owned Territories</h1>
              {ownedwc.map((wc) => (
                <Card key={wc.title}>
                  <h2>{wc.title}</h2>
                  <p>Created by {wc.owner} &lbrack{wc.createdAt.toLocaleDateString('en-US')}&rbrack</p>
                  <h4>{wc.tags.slice(0, 3).join(" ")}</h4>
                </Card>
              ))}
            </Card>
          </Col>
          <Col>
            <Card id='darkcard1'>
              <h1>Recently Explored</h1>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ListPage;
