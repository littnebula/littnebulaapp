'use client';

import { useTransition } from 'react';
import { deleteCollection } from '@/lib/dbActions';
import { Button } from 'react-bootstrap';

export default function DeleteCollectionButton({ collectionId }: { collectionId: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmed = window.confirm('Abandon This Territory?');
    if (!confirmed) return;

    startTransition(async () => {
      await deleteCollection(collectionId);
    });
  };

  return (
    <Button
      type="button"
      className="btn btn-danger btn-lg float-right" 
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? 'Deleting...' : 'Delete This Cluster'}
    </Button>
  );
}