'use client';

import { useSession } from 'next-auth/react'; // v5 compatible
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addComment, revalidatepage } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddCommentSchema } from '@/lib/validationSchemas';
import { usePathname } from "next/navigation";
import Link from 'next/link';

const AddCommentForm = ({ wcid, collid }: {wcid?: number, collid?: number }) => {
  const { data: session, status } = useSession();
  const currentUser = session?.user?.email || '';
  const pathname = usePathname();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddCommentSchema),
  });
  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    return (
      <Card id='darkcard1'>
        <Card.Header>
          To Add a Comment:
        </Card.Header>
        <Card.Body>
          <Link href="/auth/signin">Sign In</Link>
          /
          <Link href="/auth/signup">Sign Up</Link>
        </Card.Body>
      </Card>
    );
  }
  const onSubmit = async (comment: { comment: string; wordcloudId?: number, collectionId?: number, owner: string }) => {
    await addComment(comment);
    await revalidatepage(pathname);
    //   swal('Success', 'Your item has been added', 'success', {
    //     timer: 2000,
    //   });
  };
  return (
    <Card id='darkcard1'>
      <Card.Header>
        Add a Comment
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            <input
              type='text'
              {...register('comment')}
              className={`form-control ${errors.comment ? 'is-invalid' : ''} bg-dark text-light`}
              placeholder='Your Thoughts...'
            />
            <div className="invalid-feedback">{errors.comment?.message}</div>
          </Form.Group>
          <input type="hidden" {...register('owner')} value={currentUser} />
          <input type="hidden" {...register('wordcloudId')} value={wcid} />
          <input type="hidden" {...register('collectionId')} value={collid} />
          <Form.Group className="form-group">
            <Row className="pt-3">
              <Col>
                <Button type="submit" variant="primary">
                  Submit
                </Button>
              </Col>
              <Col>
                <Button type="button" onClick={() => reset()} variant="warning" className="float-right">
                  Reset
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddCommentForm;
