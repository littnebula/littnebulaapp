import { notFound } from 'next/navigation';
import { Collection } from '@prisma/client';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Container, Row } from 'react-bootstrap';
import Link from 'next/link';
import EditCollectionForm from '@/components/EditCollectionForm';
import DeleteCollectionButton from '@/components/DeleteCollectionButton';
import NotAuthorized from '@/app/not-authorized/page';


export default async function EditCollectionPage({ params }: { params: { id: string | string[] } }) {
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
  const collection: Collection | null = await prisma.collection.findUnique({
    where: { id: editID },
  });
  if (!collection) {
    return notFound();
  }
  if (usermail !== collection?.owner) {
    return NotAuthorized();
  }

  return (
    <main>
      <Container className='p-2'>
        <Row>
          <Container>
            <Link
            href={`/analyze/${collection.id}`}
            className='btn btn-gradient-grn'
            >
              Return to Cluster View
            </Link>
          </Container>
        </Row>
        <Row>
          <EditCollectionForm 
          coll={collection}
          />
          <DeleteCollectionButton collectionId={collection.id} />
        </Row>
      </Container>
    </main>
  );
}
