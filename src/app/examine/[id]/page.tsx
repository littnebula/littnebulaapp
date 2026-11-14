import { notFound } from 'next/navigation';
import { Word, WordCloud } from '@prisma/client';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
// import EditStuffForm from '@/components/EditStuffForm';
import WordCloudExaminer from '@/components/ViewWordCloudComp';
import { Container } from 'react-bootstrap';
import Link from 'next/link';

export default async function ExamineWordCloud({ params }: { params: { id: string | string[] } }) {
  const { id } = await params;
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  const currentUser: string = session?.user?.email || ' ';
  const wcID: number = +id;
  const wordcloud: WordCloud | null = await prisma.wordCloud.findUnique({
    where: {
      id: wcID,
    },
  });
  if (!wordcloud) {
    return notFound();
  }
  const wordcloudId: number = wordcloud?.id;
  const isEditor: boolean = wordcloud.editors.includes(currentUser);
  const words: Word[] = await prisma.word.findMany({
    where: {
      wordcloudId,
    }
  });

  return (
    <main>
      {/* <EditStuffForm stuff={stuff} /> */}
      {(currentUser == wordcloud.owner || isEditor) && (
        <Container>
          <Link key={wordcloud.title} href={`/edit/${wordcloud.id}`}>
            You can Edit this
          </Link>
        </Container>
      )}
      <WordCloudExaminer wordclouddata={wordcloud} words={words} />
    </main>
  );
}
