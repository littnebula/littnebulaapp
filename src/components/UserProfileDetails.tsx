import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import Link from 'next/link';

type Props = {
  id: number;
};

const UserProfileDetails = async ({ id }: Props) => {
  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      ownedWC: {
        where: {
          visibility: 'PUBLIC',
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <main>
      <Container className="py-3">
        <h1>User Profile</h1>

        <Card className="mb-4">
          <div className="card-body">
            <h4>{user.email}</h4>
            <p>
              Role: <Badge bg="secondary">{user.role}</Badge>
            </p>
            <p>Public Word Clouds: {user.ownedWC.length}</p>
          </div>
        </Card>

        <h3>Public Word Clouds</h3>

        <Row>
          {user.ownedWC.map((wordcloud) => (
            <Col md={6} lg={4} key={wordcloud.id} className="mb-3">
              <Card className="h-100">
                <div className="card-body">
                  <h5 className="card-title">{wordcloud.title}</h5>
                  <p className="card-text">{wordcloud.description}</p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Link href="/user" className="btn btn-secondary mt-3">
          Back to View Profiles
        </Link>
      </Container>
    </main>
  );
};

export default UserProfileDetails;