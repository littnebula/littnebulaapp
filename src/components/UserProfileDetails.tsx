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

        <Card
          className="mb-4 text-light border-secondary"
          style={{
            backgroundColor: 'rgba(20, 20, 20, 0.65)',
          }}
        >
          <div className="card-body">
            <h4>{user.email}</h4>
            <p>
              Role: <Badge bg="secondary">{user.role}</Badge>
            </p>
            <p className="mb-0">
              Public Word Clouds: {user.ownedWC.length}
            </p>
          </div>
        </Card>

        <h3>Public Word Clouds</h3>

        {user.ownedWC.length > 0 ? (
          <Row>
            {user.ownedWC.map((wordcloud) => (
              <Col md={6} lg={4} key={wordcloud.id} className="mb-3">
                <Link
                  href={`/examine/${wordcloud.id}`}
                  className="text-decoration-none text-reset"
                >
                  <Card
                    className="h-100 text-light border-secondary"
                    style={{
                      backgroundColor: 'rgba(20, 20, 20, 0.65)',
                    }}
                  >
                    <div className="card-body">
                      <h5 className="card-title">{wordcloud.title}</h5>

                      <p className="card-text text-secondary">
                        {wordcloud.description}
                      </p>

                      <p className="mb-2">
                        <small>Views: {wordcloud.views}</small>
                      </p>

                      <div>
                        {wordcloud.tags.map((tag) => (
                          <span
                            key={tag}
                            className="badge bg-secondary me-1 mb-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        ) : (
          <p>This user has no public word clouds.</p>
        )}

        <Link
          href="/search"
          className="btn text-light shadow mt-3"
          style={{
            backgroundColor: 'rgba(52, 58, 64, 0.9)',
            border: '1px solid #6c757d',
          }}
        >
          Back to Search
        </Link>
      </Container>
    </main>
  );
};

export default UserProfileDetails;
