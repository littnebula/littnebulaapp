import { notFound } from 'next/navigation';
import { Word, WordCloud } from '@prisma/client';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
// import EditStuffForm from '@/components/EditStuffForm';
import EditWordCloudForm from '@/components/EditWordCloudForm';
import { Col, Container, Row } from 'react-bootstrap';
import OperateWordCloudForm from '@/components/OperateWordCloudForm';
import DeleteWordCloudButton from '@/components/DeleteWordCloudButton';
import WordListing from '@/components/ListWordsFromCloud';
import Link from 'next/link';


export default async function EditWordCloudPage({ params }: { params: { id: string | string[] } }) {
  const { id } = await params;
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  const editID: number = +id;
  const usermail: string = session?.user?.email || ' ';
  const wordcloud: WordCloud | null = await prisma.wordCloud.findUnique({
    where: {
      id: editID,
    },
  });
  if (!wordcloud) {
    return notFound();
  }
  const words: Word[] = await prisma.word.findMany({
    where: {
      wordcloudId: editID,
    },
    orderBy: {
      value: "desc",
    }
  })

  return (
    <main>
      <Container className='p-2'>
        <Row>
          <Container>
            <Link
            href={`/examine/${wordcloud.id}`}
            className='btn btn-gradient-grn'
            >
              Return to Territory View
            </Link>
          </Container>
        </Row>
        <Row>
          <Col>
            <OperateWordCloudForm wc={wordcloud} />
            <WordListing words={words}/>
          </Col>
          <Col>
            <EditWordCloudForm wc={wordcloud} />
            {(usermail === wordcloud.owner) && (
              <Container className='p-4 justify-content-end d-flex'>
              <DeleteWordCloudButton wordcloudId={wordcloud.id}/>
              </Container>
            )}
          </Col>
        </Row>
      </Container>
    </main>
  );
}
