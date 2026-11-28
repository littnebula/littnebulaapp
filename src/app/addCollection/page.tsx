import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import AddCollectionForm from '@/components/AddCollectionForm';
import { prisma } from '@/lib/prisma';

const AddCollection = async () => {
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  const owner = (session && session.user && session.user.email) || '';
  const ownedwc = await prisma.wordCloud.findMany({
    where: {
      owner,
    },
  });
  // console.log(session)
  return (
    <main>
      <AddCollectionForm 
      ownedwc={ownedwc}/>
    </main>
  );
};

export default AddCollection;
