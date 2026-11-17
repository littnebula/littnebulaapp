'use client';

import { useTransition } from 'react';
import { deleteWordCloud } from '@/lib/dbActions';

export default function DeleteWordCloudButton({ wordcloudId }: { wordcloudId: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmed = window.confirm('Abandon This Territory?');
    if (!confirmed) return;

    startTransition(async () => {
      await deleteWordCloud(wordcloudId);
    });
  };

  return (
    <button
      type="button"
      className="btn btn-danger btn-sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}