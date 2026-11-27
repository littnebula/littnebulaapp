'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { WordCloud } from '@prisma/client';
import swal from 'sweetalert';
import LoadingSpinner from '@/components/LoadingSpinner';
import { createCollection } from '@/lib/dbActions';
import { CreateCollectionSchema } from '@/lib/validationSchemas';
import CheckboxDropdown, { DropdownOption } from './CheckboxDropdown';

interface CollectionFormValues {
  title: string;
  description: string;
  visibility: string;
  wordcloudIds: number[];
  owner: string;
  userId: number;
}

const AddCollectionForm = ({ ownedwc }: { ownedwc: WordCloud[] }) => {
  const [wcIds, setWCIds] = useState<number[]>([]);
  const { data: session, status } = useSession();

  const currentUser = session?.user?.email || '';
  const currentUserId = session?.user?.id ? Number(session.user.id) : 0;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CollectionFormValues>({
    resolver: yupResolver(CreateCollectionSchema) as unknown as Resolver<CollectionFormValues>,
    defaultValues: {
      title: '',
      description: '',
      visibility: 'PUBLIC',
      wordcloudIds: [],
      owner: '',
      userId: 0,
    },
  });

  useEffect(() => {
    if (currentUser) {
      setValue('owner', currentUser);
    }
    if (currentUserId) {
      setValue('userId', currentUserId);
    }
  }, [currentUser, currentUserId, setValue]);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  const datasetOptions: DropdownOption[] = ownedwc.map((wc) => ({
    id: wc.id,
    label: wc.title,
  }));

  const onSubmit = async (data: CollectionFormValues) => {
    await createCollection({
      ...data,
    });
    await swal('Success', 'Your item has been added', 'success', {
      timer: 2000,
    });
  };

  const handleReset = () => {
    setWCIds([]);
    reset({
      title: '',
      description: '',
      visibility: 'PUBLIC',
      wordcloudIds: [],
      owner: currentUser,
      userId: currentUserId,
    });
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md>
          <Col className="text-center">
            <h2>Create a New Cluster</h2>
          </Col>
          <Card id="darkcard1">
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="collectionTitle">
                  <Form.Label>Title</Form.Label>
                  <input
                    id="collectionTitle"
                    type="text"
                    {...register('title')}
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.title?.message}</div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="collectionDescription">
                  <Form.Label>Description</Form.Label>
                  <textarea
                    id="collectionDescription"
                    {...register('description')}
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.description?.message}</div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="collectionVisibility">
                  <Form.Label>Visibility</Form.Label>
                  <select
                    id="collectionVisibility"
                    {...register('visibility')}
                    className={`form-control ${errors.visibility ? 'is-invalid' : ''} bg-dark text-light`}
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="RESTRICTED">Restricted</option>
                    <option value="PRIVATE">Private</option>
                  </select>
                  <div className="invalid-feedback">{errors.visibility?.message}</div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Word Clouds</Form.Label>
                  <CheckboxDropdown
                    options={datasetOptions}
                    selectedIds={wcIds}
                    onChange={(updatedIds) => {
                      setWCIds(updatedIds);
                      setValue('wordcloudIds', updatedIds, { shouldValidate: true });
                    }}
                    placeholder="Select Data"
                  />
                  {errors.wordcloudIds && (
                    <div className="text-danger small mt-1">
                      {errors.wordcloudIds.message}
                    </div>
                  )}
                </Form.Group>

                {Object.keys(errors).length > 0 && (
                  <div className="alert alert-danger mt-3">
                    <strong>Errors:</strong>
                    <ul className="mb-0">
                      {Object.entries(errors).map(([field, error]) => (
                        <li key={field}>
                          {field}: {String(error?.message ?? 'Invalid value')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Form.Group className="form-group">
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        type="button"
                        onClick={handleReset}
                        variant="warning"
                        className="float-end"
                      >
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
