import { prisma } from '@/lib/prisma';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Link from 'next/link';

type Props = {
  searchTerm: string;
  searchType: string;
  selectedTag: string;
  submitted: boolean;
};

const Search = async ({
  searchTerm,
  searchType,
  selectedTag,
  submitted,
}: Props) => {
  const term = searchTerm.trim();

  const publicWordClouds = await prisma.wordCloud.findMany({
    where: {
      visibility: 'PUBLIC',
    },
    select: {
      tags: true,
    },
  });

  const tags = Array.from(
    new Set(publicWordClouds.flatMap((wordcloud) => wordcloud.tags)),
  ).sort();

  const users =
    submitted && (searchType === 'all' || searchType === 'users')
      ? await prisma.user.findMany({
          where: term
            ? {
                email: {
                  contains: term,
                  mode: 'insensitive',
                },
              }
            : {},
          select: {
            id: true,
            email: true,
          },
        })
      : [];

  const wordclouds =
    submitted && (searchType === 'all' || searchType === 'wordclouds')
      ? await prisma.wordCloud.findMany({
          where: {
            visibility: 'PUBLIC',
            ...(term
              ? {
                  OR: [
                    {
                      title: {
                        contains: term,
                        mode: 'insensitive',
                      },
                    },
                    {
                      description: {
                        contains: term,
                        mode: 'insensitive',
                      },
                    },
                  ],
                }
              : {}),
            ...(selectedTag
              ? {
                  tags: {
                    has: selectedTag,
                  },
                }
              : {}),
          },
          select: {
            id: true,
            title: true,
            description: true,
            tags: true,
          },
        })
      : [];

  return (
    <main>
      <Container className="py-3">
        <h1>Search</h1>
        <p>Search for users and public word clouds.</p>

        <form action="/search" method="GET" className="mb-4">
          <input type="hidden" name="submitted" value="true" />

          <Row className="g-2">
            <Col md={12}>
              <input
                type="text"
                name="q"
                className="form-control"
                placeholder="Search users or word clouds..."
                defaultValue={term}
              />
            </Col>

            <Col md={6}>
              <select
                name="type"
                className="form-select"
                defaultValue={searchType}
              >
                <option value="all">All</option>
                <option value="users">Users</option>
                <option value="wordclouds">Word Clouds</option>
              </select>
            </Col>

            <Col md={6}>
              <select
                name="tag"
                className="form-select"
                defaultValue={selectedTag}
              >
                <option value="">All Tags</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </Col>

            <Col>
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </Col>
          </Row>
        </form>

        {submitted && (searchType === 'all' || searchType === 'users') && (
          <>
            <h3>Users</h3>

            {users.length > 0 ? (
              <Row>
                {users.map((user) => (
                  <Col xs={12} key={user.id} className="mb-3">
                    <Link
                      href={`/user/${user.id}`}
                      className="text-decoration-none text-reset"
                    >
                      <Card
                        className="h-100"
                        style={{ maxWidth: '400px' }}
                      >
                        <div className="card-body">
                          <h5 className="card-title">{user.email}</h5>
                        </div>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            ) : (
              <p>No users found.</p>
            )}
          </>
        )}

        {submitted &&
          (searchType === 'all' || searchType === 'wordclouds') && (
            <>
              <h3 className="mt-4">Public Word Clouds</h3>

              {wordclouds.length > 0 ? (
                <Row>
                  {wordclouds.map((wordcloud) => (
                    <Col xs={12} key={wordcloud.id} className="mb-3">
                      <Card
                        className="h-100"
                        style={{ maxWidth: '400px' }}
                      >
                        <div className="card-body">
                          <h5 className="card-title">{wordcloud.title}</h5>

                          <p className="card-text">
                            {wordcloud.description}
                          </p>

                          <p>Tags: {wordcloud.tags.join(', ')}</p>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <p>No public word clouds found.</p>
              )}
            </>
          )}
      </Container>
    </main>
  );
};

export default Search;
