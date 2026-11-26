'use client';

import { useSession } from 'next-auth/react'; // v5 compatible
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { createCollection } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { CreateCollectionSchema } from '@/lib/validationSchemas';

const onSubmit = async (data: { 
  id: number;
  title: string;
  description: string;
  editors?: string | undefined;
  visibility: string;
  wordcloudIds: number[];
  owner: string;
  userId: number;
  }) => {
  // console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
  await createCollection(data);
  swal('Success', 'Your item has been added', 'success', {
    timer: 2000,
  });
};

const AddCollectionForm: React.FC = () => {
  const { data: session, status } = useSession();
  // console.log('AddStuffForm', status, session);
  const currentUser = session?.user?.email || '';
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreateCollectionSchema),
  });
  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md>
          <Col className="text-center">
            <h2>Create a New Cluster</h2>
          </Col>
          <Card id='darkcard1'>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <input
                    type="text"
                    {...register('title')}
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.title?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <textarea
                    {...register('description')}
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.description?.message}</div>
                </Form.Group>
                    <Form.Group>
                      <Form.Label>Visibility</Form.Label>
                      <select {...register('visibility')} className={`form-control ${errors.visibility ? 'is-invalid' : ''} bg-dark text-light`}>
                        <option value="PUBLIC">Public</option>
                        <option value="RESTRICTED">Restricted</option>
                        <option value="PRIVATE">Private</option>
                      </select>
                      <div className="invalid-feedback">{errors.visibility?.message}</div>
                    </Form.Group>
                <input type="hidden" {...register('owner')} value={currentUser} />
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
        </Col>
      </Row>
    </Container>
  );
};

export default AddCollectionForm;
