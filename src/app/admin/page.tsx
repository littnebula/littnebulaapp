import { Col, Container, Row, Table } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { adminProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import Link from 'next/link';

const AdminPage = async () => {
  const session = await auth();

  adminProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  // Get all word clouds
  const wordclouds = await prisma.wordCloud.findMany({
    include: {
      creator: {
        select: {
          email: true,
        },
      },
      editingUsers: {
        select: {
          email: true,
        },
      },
    },
  });

  // Get all users
  const users = await prisma.user.findMany({});

  return (
    <main>
      <Container id="list" fluid className="py-3">
        <Row>
          <Col>
            <h1>All Word Clouds</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Owner</th>
                  <th>Allowed Editors</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {wordclouds.map((wordcloud) => (
                  <tr key={wordcloud.id}>
                    <td>{wordcloud.title}</td>
                    <td>{wordcloud.creator.email}</td>
                    <td>
                      {wordcloud.editingUsers.length > 0
                        ? wordcloud.editingUsers
                            .map((user) => user.email)
                            .join(', ')
                        : 'None'}
                    </td>
                    <td>
                      <Link href={`/edit/${wordcloud.id}`}>Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row>
          <Col>
            <h1>All Users</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
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

export default AdminPage;
