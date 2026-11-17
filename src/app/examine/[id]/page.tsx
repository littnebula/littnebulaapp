import { notFound } from 'next/navigation';
import { VisibilityType, Word, WordCloud } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import WordCloudExaminer from '@/components/ViewWordCloudComp';
import { Col, Container, Row } from 'react-bootstrap';
import NotAuthorized from '@/app/not-authorized/page';
import { incrementWordCloudViews } from '@/lib/dbActions';
import Link from "next/link";
import { PencilSquare } from 'react-bootstrap-icons';
import { BookmarkToggleButton } from '@/components/BookmarkToggleButton';


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
  const currentUserId: number = +(session?.user?.id || '0');
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
  const bookmarkFound = await prisma.bookmarkedWC.findUnique({
    where: {
      userId_wordcloudId: {
        userId: currentUserId,
        wordcloudId: wcID
      }
    }
  })
  // console.log(bookmarkFound);
  if (!(currentUser == wordcloud.owner || isEditor)) {
    incrementWordCloudViews(wordcloud.id);
  }

  return (
    <main>
      <Container>
        <Row>
          <Col>
            <h1 className="text-wrap text-break">{wordcloud.title}</h1>
            <h4>Created by {wordcloud.owner}</h4>
          </Col>
          <Col className="justify-content-end">
            {(currentUser == wordcloud.owner || isEditor) && (
              <Link 
                key={wordcloud.title} 
                href={`/edit/${wordcloud.id}`}
                className='btn btn-solid-grn'
              >
                <PencilSquare/> Edit
              </Link>
            )}
            {(session?.user) && (
              <BookmarkToggleButton 
              userId={currentUserId}
              wordcloudId={wcID}
              initialIsBookmarked={bookmarkFound? true : false}
              />
            )}
          </Col>
        </Row>
        <Row>
          <h6>({wordcloud.createdAt.toLocaleDateString('en-US')})</h6>
          <h6 className="text-wrap text-break">[{wordcloud.tags.join('] [')}]</h6>
        </Row>
        <WordCloudExaminer 
        wordclouddata={wordcloud} 
        words={words} 
        />
      </Container>
    </main>
  );
}
