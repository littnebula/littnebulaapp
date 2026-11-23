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

  // Getting the tags
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

  // Searching for users with email
  const users =
    submitted && !selectedTag && (searchType === 'all' || searchType === 'users')
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

  // Search for word clouds
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
            views: true,
            creator: {
              select: {
                email: true,
              },
            },
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

          <Row className="g-3">
            <Col md={12}>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-dark text-light border-secondary">
                  &#x1F50D;
                </span>
                <input
                  type="text"
                  name="q"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Search users, territories..."
                  defaultValue={term}
                />
              </div>
            </Col>

            <Col md={6}>
              <div className="btn-group w-100" role="group">
                <input
                  type="radio"
                  className="btn-check"
                  name="type"
                  id="search-all"
                  value="all"
                  defaultChecked={searchType === 'all'}
                />
                <label
                  className="btn btn-outline-light"
                  htmlFor="search-all"
                >
                  All
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="type"
                  id="search-users"
                  value="users"
                  defaultChecked={searchType === 'users'}
                />
                <label
                  className="btn btn-outline-light"
                  htmlFor="search-users"
                >
                  Users
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="type"
                  id="search-wordclouds"
                  value="wordclouds"
                  defaultChecked={searchType === 'wordclouds'}
                />
                <label
                  className="btn btn-outline-light"
                  htmlFor="search-wordclouds"
                >
                  Word Clouds
                </label>
              </div>
            </Col>

            <Col md={6}>
              <select
                name="tag"
                className="form-select form-select-lg bg-dark text-light border-secondary"
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

            <Col md={12}>
                <button           // Good Button look!?
                type="submit"
                className="btn text-light shadow"
                style={{
                  backgroundColor: 'rgba(52, 58, 64, 0.9)',
                  border: '1px solid #6c757d',
                }}
              >
                Search
              </button>
            </Col>
          </Row>
        </form>

        {submitted &&
          !selectedTag &&
          (searchType === 'all' || searchType === 'users') && (
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
                          className="h-100 text-light border-secondary"
                          style={{
                            maxWidth: '400px',
                            backgroundColor: 'rgba(20, 20, 20, 0.65)',
                          }}
                        >
                          <div className="card-body">
                            <h5 className="card-title">{user.email}</h5>
                            <p className="card-text text-secondary mb-0">
                              View Profile
                            </p>
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
                      <Link
                        href={`/examine/${wordcloud.id}`}
                        className="text-decoration-none text-reset"
                      >
                        <Card
                          className="h-100 text-light border-secondary"
                          style={{
                            maxWidth: '400px',
                            backgroundColor: 'rgba(20, 20, 20, 0.65)',
                          }}
                        >
                          <div className="card-body">
                            <h5 className="card-title">
                              {wordcloud.title}
                            </h5>

                            <p className="card-text text-secondary">
                              {wordcloud.description}
                            </p>

                            <p className="mb-2">
                              <small>
                                Owner: {wordcloud.creator.email}
                              </small>
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
                <p>No public word clouds found.</p>
              )}
            </>
          )}
      </Container>
    </main>
  );
};

export default Search;
