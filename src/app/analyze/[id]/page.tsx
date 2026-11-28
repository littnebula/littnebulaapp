import { notFound } from 'next/navigation';
import { VisibilityType, Word, } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Col, Container, Row } from 'react-bootstrap';
import NotAuthorized from '@/app/not-authorized/page';
import AnalyzerMainComponent from '@/components/AnalyzerMainComp';
import Link from 'next/link';
import { PencilSquare } from 'react-bootstrap-icons';

export default async function AnalyzeCollection({ params }: { params: { id: string | string[] } }) {
  const { id } = await params;
  // Protect the page, only logged in users can access it.
  const session = await auth();
  const currentUser: string = session?.user?.email || ' ';
  // const currentUserId: number = +(session?.user?.id || '0');
  const collectionId: number = +id;
  const collectionResult = await prisma.collection.findUnique({
    where: { id: collectionId},
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
  console.log(collectionResult)
  if (!collectionResult) {
    return notFound();
  }
  // console.log(collectionResult)
  const { dataset, comments, ...collection } = collectionResult;
  const wordclouds = dataset.map((item) => item.wordcloud);
  const words: Word[][] = dataset.map((item) => item.wordcloud.wordData)
  console.log(collection)
  const isOwner: boolean = collection.owner === currentUser;
  if (collection.visibility == VisibilityType.PRIVATE && !isOwner) {
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
  
  const alltags: string[] = [];
  wordclouds.forEach(wc => {
    alltags.push(...wc.tags);
  });

  return (
    <main>
      <Container>
        <Container style={{height: '40px'}}/>
        <Row>
          <Col>
            <h2>{collection.title}</h2>
            <h5>[{[...new Set(alltags)].join('] [')}]</h5>
          </Col>
          <Col>
            {(isOwner) && (
              <Link 
                key={collection.title} 
                href={`/editCollection/${collectionId}`}
                className='btn btn-solid-grn py-2'
              >
              <PencilSquare/> Edit
              </Link>
            )}
          </Col>
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
