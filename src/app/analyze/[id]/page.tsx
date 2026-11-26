import { notFound } from 'next/navigation';
import { Collection, Comment, VisibilityType, Word, WordCloud } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import WordCloudExaminer from '@/components/ViewWordCloudComp';
import { Col, Container, Row } from 'react-bootstrap';
import NotAuthorized from '@/app/not-authorized/page';
import { incrementWordCloudViews } from '@/lib/dbActions';
import Link from "next/link";
import { PencilSquare } from 'react-bootstrap-icons';
import { BookmarkToggleButton } from '@/components/BookmarkToggleButton';


export default async function AnalyzeCollection({ params }: { params: { id: string | string[] } }) {
  const { id } = await params;
  // Protect the page, only logged in users can access it.
  const session = await auth();
  const currentUser: string = session?.user?.email || ' ';
  const currentUserId: number = +(session?.user?.id || '0');
  const collectionId: number = +id;
  const collection: Collection | null = await prisma.collection.findUnique({
    where: {
      id: collectionId,
    },
  });
  console.log(collection)
  if (!collection) {
    return notFound();
  }
  const isEditor: boolean = collection.editors.includes(currentUser);
  if (collection.visibility == VisibilityType.PRIVATE && currentUser !== collection.owner && !isEditor) {
    return NotAuthorized();
  }
  const wordClouds: WordCloud[] = await prisma.wordCloud.findMany({
  where: {
    datasetLinks: {
      some: {
        collectionId: collectionId,
      },
    },
  }});
  console.log(wordClouds)
//   const words: Word[] = await prisma.word.findMany({
//     where: {
//       wordcloudId: wordcloud?.id
//     },
//     orderBy: {
//       value: "desc",
//     }
//   });
  const comments: Comment[] = await prisma.comment.findMany({
    where: {
      collectionId: collection?.id
    }
  })
  console.log(comments)
//   const bookmarkFound = await prisma.bookmarkedWC.findUnique({
//     where: {
//       userId_wordcloudId: {
//         userId: currentUserId,
//         wordcloudId: wcID
//       }
//     }
//   })
  // console.log(bookmarkFound);
  if (!(currentUser == collection.owner || isEditor)) {
    // incrementWordCloudViews(wordcloud.id);
  }

  return (
    <main>
      <Container>
        
      </Container>
    </main>
  );
}
