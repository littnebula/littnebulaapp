import { prisma } from '@/lib/prisma';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import Link from 'next/link';

const ViewProfile = async () => {
  const users = await prisma.user.findMany({
    include: {
      ownedWC: {
        where: {
          visibility: 'PUBLIC',
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  });

  return (
    <main>
      <Container fluid className="py-3">
        <h1>View Profiles</h1>
        <p>View other users and their public word clouds.</p>

        <Row>
          {users.map((user) => (
            <Col md={6} lg={4} key={user.id} className="mb-3">
              <Card className="h-100">
                <div className="card-body">
                  <h5 className="card-title">{user.email}</h5>

                  <p>
                    Role: <Badge bg="secondary">{user.role}</Badge>
                  </p>

                  <p>
                    Public Word Clouds: {user.ownedWC.length}
                  </p>

                  <Link
                    href={`/user/${user.id}`}
                    className="btn btn-primary"
                  >
                    View Profile
                  </Link>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </main>
  );
};

export default ViewProfile;
