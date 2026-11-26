'use client';

import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import { WordCloud } from '@prisma/client';
import { ModifyWordCloudSchema } from '@/lib/validationSchemas';
import { editWordCloud } from '@/lib/dbActions';
import { getSupportedLocales, languageSet } from '@/lib/WordCloudActions';
import { JSX } from 'react/jsx-runtime';
import IconSelect from './IconSelectForm';
import { useState } from 'react';

const onSubmit = async (data: { 
  id: number;
  bibliography: string;
  language: string;
  title: string;
  description: string;
  displayCount: number;
  tags: string;
  editors?: string | undefined;
  visibility: string;
  displayColorHue: number;
  displayColorSat: number;
  displayColorLit: number;
  displayIcon: string;
  owner: string;
  creatorId: number;
  }) => {
  console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
  await editWordCloud(data);
  swal('Success', 'Your item has been updated', 'success', {
    timer: 2000,
  });
};

const EditWordCloudForm = ({ wc }: { wc: WordCloud }) => {
  const [hue, setHue] = useState(wc.displayColorHue);
  const [sat, setSat] = useState(wc.displayColorSat);
  const [lit, setLit] = useState(wc.displayColorLit);
  const [selectedIcon, setSelectedIcon] = useState(wc.displayIcon);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ModifyWordCloudSchema),
  });
  // console.log(wc);
  const strEditors: string = wc.editors.join(' ');
  const strTags: string = wc.tags.join(' ');
  const langOptions: JSX.Element[] | null | undefined = [];
  getSupportedLocales().forEach((tag) => {
    langOptions.push(
      <option key={tag} value={tag}>{languageSet[tag]}</option>
    )
  })
  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col>
          <Card id='darkcard1'>
            <Card.Header className="text-center">
              <h2>Edit Word Cloud</h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register('id')} value={wc.id} />
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <input
                    type="text"
                    {...register('title')}
                    defaultValue={wc.title}
                    required
                    className={`form-control ${errors.title ? 'is-invalid' : ''} bg-dark text-light`}
                  />
                  <div className="invalid-feedback">{errors.title?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Visibility</Form.Label>
                  <select
                    {...register('visibility')}
                    className={`form-control ${errors.visibility ? 'is-invalid' : ''} bg-dark text-light`}
                    defaultValue={wc.visibility}
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="RESTRICTED">Restricted</option>
                    <option value="PRIVATE">Private</option>
                  </select>
                  <div className="invalid-feedback">{errors.visibility?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <textarea
                    {...register('description')}
                    defaultValue={wc.description}
                    required
                    className={`form-control ${errors.description ? 'is-invalid' : ''} bg-dark text-light`}
                    rows={9}
                  />
                  <div className="invalid-feedback">{errors.description?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Bibliography</Form.Label>
                  <textarea
                    {...register('bibliography')}
                    defaultValue={wc.bibliography}
                    required
                    className={`form-control ${errors.bibliography ? 'is-invalid' : ''} bg-dark text-light`}
                    rows={6}
                  />
                  <div className="invalid-feedback">{errors.bibliography?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Language</Form.Label>
                  <select 
                    {...register('language')} 
                    className={`form-control ${errors.language ? 'is-invalid' : ''} bg-dark text-light`}
                    defaultValue={wc.language}
                  >
                    {langOptions}
                  </select>
                  <div className="invalid-feedback">{errors.language?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Tags</Form.Label>
                  <input
                    type="text"
                    {...register('tags')}
                    defaultValue={strTags}
                    required
                    className={`form-control ${errors.tags ? 'is-invalid' : ''} bg-dark text-light`}
                  />
                  <div className="invalid-feedback">{errors.tags?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Number of Words to Display</Form.Label>
                  <input
                    type="number"
                    {...register('displayCount')}
                    defaultValue={wc.displayCount}
                    className={`form-control ${errors.displayCount ? 'is-invalid' : ''} bg-dark text-light`}
                  />
                  <div className="invalid-feedback">{errors.displayCount?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Editors</Form.Label>
                  <input
                    type="text"
                    {...register('editors')}
                    defaultValue={strEditors}
                    className={`form-control ${errors.editors ? 'is-invalid' : ''} bg-dark text-light`}
                    placeholder='User Emails separated by spaces...'
                  />
                  <div className="invalid-feedback">{errors.editors?.message}</div>
                </Form.Group>
                <hr/>
                <Row>
                  <Col className='col-3'>
                    <h5>Display Icon</h5>
                  </Col>
                  <Col>
                    <IconSelect
                      name="displayIcon"
                      value={selectedIcon}
                      onChange={(icon) => {
                        setSelectedIcon(icon)
                        setValue('displayIcon', icon, { shouldValidate: true, shouldDirty: true });
                      }}
                      columns={9}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className='col-3'>
                    <h5>Display Color</h5>
                  </Col>
                  <Col>
                    <Container className='p-1'>
                      <div 
                        className="rounded w-auto " 
                        style={{ 
                          height: '12px',
                          background: `hsla(${hue}, ${sat}%, ${lit}%)`
                        }}
                      />
                    </Container>
                  </Col>
                </Row>
                <Row className='p-2'>
                  <Col>
                    <Form.Group>
                      <Form.Label className='d-block text-center'>
                        Hue: {hue}
                      </Form.Label>
                      <input
                        type="range"
                        className="form-range"
                        id="numberRange"
                        defaultValue={wc.displayColorHue}
                        {...register('displayColorHue')}
                        min={0}
                        max={360}
                        step={1}
                        value={hue}
                        onChange={(e) => setHue(Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label className='d-block text-center'>
                        Saturation: {sat}
                      </Form.Label>
                      <input
                        type="range"
                        className="form-range"
                        id="numberRange"
                        defaultValue={wc.displayColorSat}
                        {...register('displayColorSat')}
                        min={0}
                        max={100}
                        step={1}
                        value={sat}
                        onChange={(e) => setSat(Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label className='d-block text-center'>
                        Lightness: {lit}
                      </Form.Label>
                      <input
                        type="range"
                        className="form-range"
                        id="numberRange"
                        defaultValue={wc.displayColorLit}
                        {...register('displayColorLit')}
                        min={50}
                        max={100}
                        step={1}
                        value={lit}
                        onChange={(e) => setLit(Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <input type="hidden" {...register('owner')} value={wc.owner} />
                <input type="hidden" {...register('creatorId')} value={wc.creatorId} />
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

export default EditWordCloudForm;
