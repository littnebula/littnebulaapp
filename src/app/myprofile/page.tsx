import { Container, } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import UserDashboard from '@/components/UserDashboard';

/** Render a list of stuff for the logged in user. */
const ListPage = async () => {
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  const owner = (session && session.user && session.user.email) || '';
  const ownerId: number = +(session?.user?.id || 0); 
  const ownedwc = await prisma.wordCloud.findMany({
    where: {
      owner,
    },
  });
  const markedwc = await prisma.bookmarkedWC.findMany({
    where: {
      userId: ownerId
    },
    include: {
      wordcloud: true
    }
  })
  return (
    <main>
      <Container id="list" fluid className="py-3">
        <UserDashboard 
        ownedwc={ownedwc}
        bookmarkedwc={markedwc.map((bkm) => bkm.wordcloud)}
        recentwc={ownedwc}/>
      </Container>
    </main>
  );
};

export default ListPage;
