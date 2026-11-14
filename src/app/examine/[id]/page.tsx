import { notFound } from 'next/navigation';
import { Word, WordCloud } from '@prisma/client';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
// import EditStuffForm from '@/components/EditStuffForm';
import WordCloudExaminer from '@/components/ViewWordCloudComp';

export default async function ExamineWordCloud({ params }: { params: { id: string | string[] } }) {
  const { id } = await params;
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  // const editID: number = +id;
  // const stuff: Stuff | null = await prisma.stuff.findUnique({
  //   where: {
  //     id: editID,
  //   },
  // });
  // if (!stuff) {
  //   return notFound();
  // }
  const wcID: number = +id;
  const wordcloud: WordCloud | null = await prisma.wordCloud.findUnique({
    where: {
      id: wcID,
    },
  });
  if (!wordcloud) {
    return notFound();
  }
  const wordcloudId = wordcloud?.id;
  const words: Word[] = await prisma.word.findMany({
    where: {
      wordcloudId,
    }
  });

  return (
    <main>
      {/* <EditStuffForm stuff={stuff} /> */}
      <WordCloudExaminer wordclouddata={wordcloud} words={words} />
    </main>
  );
}
