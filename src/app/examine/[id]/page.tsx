import { notFound } from 'next/navigation';
import { VisibilityType, Word, WordCloud } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import WordCloudExaminer from '@/components/ViewWordCloudComp';
import { Container } from 'react-bootstrap';
import NotAuthorized from '@/app/not-authorized/page';
import { incrementWordCloudViews } from '@/lib/dbActions';


export default async function ExamineWordCloud({ params }: { params: { id: string | string[] } }) {
  const { id } = await params;
  // Protect the page, only logged in users can access it.
  const session = await auth();
  // loggedInProtectedPage(
  //   session as {
  //     user: { email: string; id: string; name: string };
  //   } | null,
  // );
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
  const isEditor: boolean = wordcloud.editors.includes(currentUser);
  if (wordcloud.visibility == VisibilityType.PRIVATE && currentUser !== wordcloud.owner && !isEditor) {
    return NotAuthorized();
  }
  const words: Word[] = await prisma.word.findMany({
    where: {
      wordcloudId: wordcloud?.id
    }
  });
  if (!(currentUser == wordcloud.owner || isEditor)) {
    incrementWordCloudViews(wordcloud.id);
  }
  return (
    <main>
      <Container>
        <WordCloudExaminer 
        wordclouddata={wordcloud} 
        words={words} 
        canEdit={(currentUser == wordcloud.owner || isEditor)}
        />
      </Container>
    </main>
  );
}
