'use client';
import { useSession } from 'next-auth/react'; // v5 compatible
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { addNewWordCloud } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { GenerateWordCloudSchema } from '@/lib/validationSchemas';
import { getSupportedLocales, languageSet } from '@/lib/WordCloudActions';
import { JSX } from 'react/jsx-runtime';

const onSubmit = async (data: { 
  sourceText: string; 
  bibliography: string;
  language: string;
  title: string;
  description: string;
  tags: string;
  visibility: string;
  owner: string;
  creatorId: number;
  }) => {
  console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
  await addNewWordCloud(data);
  swal('Success', 'Your item has been added', 'success', {
    timer: 2000,
  });
};

const AddWordCloudForm: React.FC = () => {
  const { data: session, status } = useSession();
  // console.log('AddWordCloudForm', status, session);
  const currentUser = session?.user?.email || '';
  const currentUserId = session?.user?.id || '';
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(GenerateWordCloudSchema),
  });
  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  const langOptions: JSX.Element[] | null | undefined = [];
  getSupportedLocales().forEach((tag) => {
    langOptions.push(
      <option key={tag} value={tag}>{languageSet[tag]}</option>
    )
  })

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md>
          <Col className="text-center">
            <h2>Embark on Voyage, Start new Territory</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Form.Group>
                    <Form.Label>Source Text</Form.Label>
                    <textarea
                      {...register('sourceText')}
                      className={`form-control ${errors.sourceText ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.sourceText?.message}</div>
                  </Form.Group>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Language</Form.Label>
                      <select {...register('language')} className={`form-control ${errors.language ? 'is-invalid' : ''}`}>
                        {langOptions}
                      </select>
                      <div className="invalid-feedback">{errors.language?.message}</div>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Source Bibliography</Form.Label>
                      <textarea
                        {...register('bibliography')}
                        className={`form-control ${errors.bibliography ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.bibliography?.message}</div>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Tags</Form.Label>
                      <input
                        type='text'
                        {...register('tags')}
                        className={`form-control ${errors.tags ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.tags?.message}</div>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Title</Form.Label>
                      <input
                        type='text'
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
                      <select {...register('visibility')} className={`form-control ${errors.visibility ? 'is-invalid' : ''}`}>
                        <option value="PUBLIC">Public</option>
                        <option value="RESTRICTED">Restricted</option>
                        <option value="PRIVATE">Private</option>
                      </select>
                      <div className="invalid-feedback">{errors.visibility?.message}</div>
                    </Form.Group>
                  </Col>
                </Row>
                <input type="hidden" {...register('owner')} value={currentUser} />
                <input type="hidden" {...register('creatorId')} value={parseInt(currentUserId)} />
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

export default AddWordCloudForm;