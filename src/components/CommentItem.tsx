'use client';
import { Comment } from '@prisma/client';
import { ListGroup } from 'react-bootstrap';

/* Renders a single row in the Listgroup section in contactcards. */
const CommentItem = ({ comment }: { comment: Comment }) => (
  <ListGroup.Item>
    <p>{comment.comment}</p>
    <p className="fw-lighter">{comment.owner} ({comment.timestamp.toLocaleDateString('en-US')})</p>
  </ListGroup.Item>
);

export default CommentItem;