import { notFound } from 'next/navigation';
import { WordCloud } from '@prisma/client';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
// import EditStuffForm from '@/components/EditStuffForm';
import EditWordCloudForm from '@/components/EditWordCloudForm';
import { Col, Container, Row } from 'react-bootstrap';
import OperateWordCloudForm from '@/components/OperateWordCloudForm';

export default async function EditStuffPage({ params }: { params: { id: string | string[] } }) {
  const { id } = await params;
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  const editID: number = +id;
  const wordcloud: WordCloud | null = await prisma.wordCloud.findUnique({
    where: {
      id: editID,
    },
  });
  if (!wordcloud) {
    return notFound();
  }

  return (
    <main>
      <Container className='p-4'>
        <Row>
          <Col>
            <OperateWordCloudForm wc={wordcloud} />
          </Col>
          <Col>
            <EditWordCloudForm wc={wordcloud} />
          </Col>
        </Row>
      </Container>
    </main>
  );
}
