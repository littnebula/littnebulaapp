import { prisma } from '@/lib/prisma';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Link from 'next/link';
import WordCloudCard from '@/components/WordCloudCard';

type Props = {
  searchTerm: string;
  searchType: string;
  selectedTag: string;
  sortBy: string;
  submitted: boolean;
};

// Differentiating from two words
const editDistance = (first: string, second: string) => {
  const table = Array.from(
    { length: first.length + 1 },
    () => Array(second.length + 1).fill(0),
  );

  for (let i = 0; i <= first.length; i++) {
    table[i][0] = i;
  }

  for (let j = 0; j <= second.length; j++) {
    table[0][j] = j;
  }

  for (let i = 1; i <= first.length; i++) {
    for (let j = 1; j <= second.length; j++) {
      const cost = first[i - 1] === second[j - 1] ? 0 : 1;

      table[i][j] = Math.min(
        table[i - 1][j] + 1,
        table[i][j - 1] + 1,
        table[i - 1][j - 1] + cost,
      );
    }
  }

  return table[first.length][second.length];
};

// Checking for exact or similar words
const matchesSearch = (value: string, searchTerm: string) => {
  const queryWords = searchTerm.toLowerCase().match(/[a-z0-9]+/g) || [];
  const textWords = value.toLowerCase().match(/[a-z0-9]+/g) || [];

  return queryWords.every((queryWord) =>
    textWords.some((textWord) => {
      if (textWord.includes(queryWord)) {
        return true;
      }

      const maxDistance = Math.max(
        1,
        Math.floor(queryWord.length * 0.25),
      );

      return editDistance(queryWord, textWord) <= maxDistance;
    }),
  );
};

const Search = async ({
  searchTerm,
  searchType,
  selectedTag,
  sortBy,
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
  const allUsers =
    submitted && !selectedTag && (searchType === 'all' || searchType === 'users')
      ? await prisma.user.findMany({
          select: {
            id: true,
            email: true,
          },
        })
      : [];

  const users = term
    ? allUsers.filter((user) => matchesSearch(user.email, term))
    : allUsers;

  // Search for word clouds
  const wordclouds =
    submitted && (searchType === 'all' || searchType === 'wordclouds')
      ? await prisma.wordCloud.findMany({
          where: {
            visibility: 'PUBLIC',
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
            bookmarks: true,
            createdAt: true,
            creator: {
              select: {
                email: true,
              },
            },
          },
        })
      : [];

  // Filter word clouds using fuzzy search.
  const filteredWordClouds = term
    ? wordclouds.filter((wordcloud) =>
        matchesSearch(
          `${wordcloud.title} ${wordcloud.description} ${wordcloud.tags.join(' ')}`,
          term,
        ),
      )
    : wordclouds;

  // Sort word clouds.
  filteredWordClouds.sort((a, b) => {
    if (sortBy === 'popular') {
      return b.bookmarks - a.bookmarks;
    }

    if (sortBy === 'views') {
      return b.views - a.views;
    }

    return b.createdAt.getTime() - a.createdAt.getTime();
  });

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

            <Col md={3}>
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

            <Col md={3}>
              <select
                name="sort"
                className="form-select form-select-lg bg-dark text-light border-secondary"
                defaultValue={sortBy}
              >
                <option value="recent">Recently Created</option>
                <option value="popular">Most Popular</option>
                <option value="views">Most Viewed</option>
              </select>
            </Col>

            <Col md={12}>
              <button
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

              {filteredWordClouds.length > 0 ? (
                <Row>
                  {filteredWordClouds.map((wordcloud) => (
                    <Col xs={12} key={wordcloud.id} className="mb-3">
                      <WordCloudCard
                        id={wordcloud.id}
                        title={wordcloud.title}
                        description={wordcloud.description}
                        owner={wordcloud.creator.email}
                        views={wordcloud.views}
                        tags={wordcloud.tags}
                      />
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
