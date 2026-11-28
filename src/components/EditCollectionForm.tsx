'use client';

import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import { Collection } from '@prisma/client';
import { EditCollectionSchema } from '@/lib/validationSchemas';
import { editCollection } from '@/lib/dbActions';
import { getSupportedLocales, languageSet } from '@/lib/WordCloudActions';
import { JSX } from 'react/jsx-runtime';
import IconSelect from './IconSelectForm';
import { useState } from 'react';

const onSubmit = async (data: { 
  id: number;
  title: string;
  description: string;
  visibility: string;
  trendingWords: string;
  leftdisplayColorHue: number;
  leftdisplayColorSat: number;
  leftdisplayColorLit: number;
  rightdisplayColorHue: number;
  rightdisplayColorSat: number;
  rightdisplayColorLit: number;
  displayIcon: string;
  }) => {
  console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
  await editCollection(data);
  swal('Success', 'Your item has been updated', 'success', {
    timer: 2000,
  });
};

const EditCollectionForm = ({ coll }: { coll: Collection }) => {
  const [lhue, setlHue] = useState(coll.leftdisplayColorHue);
  const [lsat, setlSat] = useState(coll.leftdisplayColorSat);
  const [llit, setlLit] = useState(coll.leftdisplayColorLit);
  const [rhue, setrHue] = useState(coll.rightdisplayColorHue);
  const [rsat, setrSat] = useState(coll.rightdisplayColorSat);
  const [rlit, setrLit] = useState(coll.rightdisplayColorLit);
  const [selectedIcon, setSelectedIcon] = useState(coll.displayIcon);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(EditCollectionSchema),
    defaultValues: {
      displayIcon: coll.displayIcon,
      leftdisplayColorHue: coll.leftdisplayColorHue,
      leftdisplayColorSat: coll.leftdisplayColorSat,
      leftdisplayColorLit: coll.leftdisplayColorLit,
      rightdisplayColorHue: coll.rightdisplayColorHue,
      rightdisplayColorSat: coll.rightdisplayColorSat,
      rightdisplayColorLit: coll.rightdisplayColorLit,
    }
  });
  // console.log(coll);
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
              <h2>Edit Cluster Aspects</h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register('id')} value={coll.id} />
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <input
                    type="text"
                    {...register('title')}
                    defaultValue={coll.title}
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
                    defaultValue={coll.visibility}
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
                    defaultValue={coll.description}
                    required
                    className={`form-control ${errors.description ? 'is-invalid' : ''} bg-dark text-light`}
                    rows={9}
                  />
                  <div className="invalid-feedback">{errors.description?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Words To Analyze for Trends</Form.Label>
                  <input
                    type='text'
                    {...register('trendingWords')}
                    className={`form-control ${errors.trendingWords ? 'is-invalid' : ''} bg-dark text-light`}
                    maxLength={300}
                    defaultValue={coll.trendingWords.join(' ')}
                    placeholder='Words separated by spaces...'
                  />
                  <div className="invalid-feedback">{errors.trendingWords?.message}</div>
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
                    <h5>Primary Display Color</h5>
                  </Col>
                  <Col>
                    <Container className='p-1'>
                      <div 
                        className="rounded w-auto " 
                        style={{ 
                          height: '12px',
                          background: `hsla(${lhue}, ${lsat}%, ${llit}%)`
                        }}
                      />
                    </Container>
                  </Col>
                </Row>
                <Row className='p-2'>
                  <Col>
                    <Form.Group>
                      <Form.Label className='d-block text-center'>
                        Hue: {lhue}
                      </Form.Label>
                      <input
                        type="range"
                        className="form-range"
                        id="numberRange"
                        defaultValue={coll.leftdisplayColorHue}
                        {...register('leftdisplayColorHue')}
                        min={0}
                        max={360}
                        step={1}
                        value={lhue}
                        onChange={(e) => setlHue(Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label className='d-block text-center'>
                        Saturation: {lsat}
                      </Form.Label>
                      <input
                        type="range"
                        className="form-range"
                        id="numberRange"
                        defaultValue={coll.leftdisplayColorSat}
                        {...register('leftdisplayColorSat')}
                        min={0}
                        max={100}
                        step={1}
                        value={lsat}
                        onChange={(e) => setlSat(Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label className='d-block text-center'>
                        Lightness: {llit}
                      </Form.Label>
                      <input
                        type="range"
                        className="form-range"
                        id="numberRange"
                        defaultValue={coll.leftdisplayColorLit}
                        {...register('leftdisplayColorLit')}
                        min={50}
                        max={100}
                        step={1}
                        value={llit}
                        onChange={(e) => setlLit(Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className='col-3'>
                    <h5>Secondary Display Color</h5>
                  </Col>
                  <Col>
                    <Container className='p-1'>
                      <div 
                        className="rounded w-auto " 
                        style={{ 
                          height: '12px',
                          background: `hsla(${rhue}, ${rsat}%, ${rlit}%)`
                        }}
                      />
                    </Container>
                  </Col>
                </Row>
                <Row className='p-2'>
                  <Col>
                    <Form.Group>
                      <Form.Label className='d-block text-center'>
                        Hue: {rhue}
                      </Form.Label>
                      <input
                        type="range"
                        className="form-range"
                        id="numberRange"
                        defaultValue={coll.rightdisplayColorHue}
                        {...register('rightdisplayColorHue')}
                        min={0}
                        max={360}
                        step={1}
                        value={rhue}
                        onChange={(e) => setrHue(Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label className='d-block text-center'>
                        Saturation: {rsat}
                      </Form.Label>
                      <input
                        type="range"
                        className="form-range"
                        id="numberRange"
                        defaultValue={coll.rightdisplayColorSat}
                        {...register('rightdisplayColorSat')}
                        min={0}
                        max={100}
                        step={1}
                        value={rsat}
                        onChange={(e) => setrSat(Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label className='d-block text-center'>
                        Lightness: {rlit}
                      </Form.Label>
                      <input
                        type="range"
                        className="form-range"
                        id="numberRange"
                        defaultValue={coll.rightdisplayColorLit}
                        {...register('rightdisplayColorLit')}
                        min={50}
                        max={100}
                        step={1}
                        value={rlit}
                        onChange={(e) => setrLit(Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                </Row>
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

export default EditCollectionForm;
