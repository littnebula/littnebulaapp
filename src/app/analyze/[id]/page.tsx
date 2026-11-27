import { notFound } from 'next/navigation';
import { VisibilityType, Word, } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
// import WordCloudExaminer from '@/components/ViewWordCloudComp';
import { Container, Row } from 'react-bootstrap';
import NotAuthorized from '@/app/not-authorized/page';
import AnalyzerMainComponent from '@/components/AnalyzerMainComp';
import Link from 'next/link';
import { PencilSquare } from 'react-bootstrap-icons';
// import { incrementWordCloudViews } from '@/lib/dbActions';
// import Link from "next/link";
// import { PencilSquare } from 'react-bootstrap-icons';
// import { BookmarkToggleButton } from '@/components/BookmarkToggleButton';


export default async function AnalyzeCollection({ params }: { params: { id: string | string[] } }) {
  const { id } = await params;
  // Protect the page, only logged in users can access it.
  const session = await auth();
  const currentUser: string = session?.user?.email || ' ';
  // const currentUserId: number = +(session?.user?.id || '0');
  const collectionId: number = +id;
  const collectionResult = await prisma.collection.findUnique({
    where: { id: 1},
    include: {
      dataset: {
        include: {
          wordcloud: {
            include: {
              wordData: true,
            }
          }
        }
      },
      comments: true
    }
  });
  if (!collectionResult) {
    return notFound();
  }
  // console.log(collectionResult)
  const { dataset, comments, ...collection } = collectionResult;
  const wordclouds = dataset.map((item) => item.wordcloud);
  const words: Word[][] = dataset.map((item) => item.wordcloud.wordData)
  console.log(collection)
  const isEditor: boolean = collection.editors.includes(currentUser);
  if (collection.visibility == VisibilityType.PRIVATE && currentUser !== collection.owner && !isEditor) {
    return NotAuthorized();
  }



  // const wordClouds: WordCloud[] = await prisma.wordCloud.findMany({
  // where: {
  //   datasetLinks: {
  //     some: {
  //       collectionId: collectionId,
  //     },
  //   },
  // },
  // include: {
  //   wordData: true,
  // }
  // });
  console.log(wordclouds)
  console.log(comments)
  if (!(currentUser == collection.owner || isEditor)) {
  }

  return (
    <main>
      <Container>
        <Row>
          {(currentUser == collection.owner || isEditor) && (
            <Link 
              key={collection.title} 
              href={`/editCollection/${collectionId}`}
              className='btn btn-solid-grn py-2'
            >
            <PencilSquare/> Edit
            </Link>
          )}
        </Row>
        <AnalyzerMainComponent 
        collData={collection}
        wordclouds={wordclouds}
        words={words}
        comments={comments}
        />
      </Container>
    </main>
  );
}
