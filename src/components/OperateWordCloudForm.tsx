'use client';
import { deleteLowValue, deleteText, onIgnoreValue, onIgnoreText } from "@/lib/dbActions";
import { OperatingOnWordsbyText, OperatingOnWordsbyValue } from "@/lib/validationSchemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { WordCloud } from "@prisma/client";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useForm } from 'react-hook-form';

type IgnoreFormValues = {
  words: string;
  wcid: number;
};

// negates all words found in words for the current 
const IgnoreOperationbyText = ({ wordcloudId }: { wordcloudId: number }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IgnoreFormValues>({
    resolver: yupResolver(OperatingOnWordsbyText),
  });
  return (
    <Form onSubmit={handleSubmit(onIgnoreText)}>
      <input type="hidden" {...register('wcid')} value={wordcloudId} />
      <Form.Group>
        <Form.Label>Words to be Ignored</Form.Label>
        <input
        type="text"
        {...register('words')}
        required
        className={`form-control ${errors.words ? 'is-invalid' : ''}`}
        placeholder="words separated by spaces..."
        />
        <div className="invalid-feedback">{errors.words?.message}</div>
      </Form.Group>
      <Form.Group className="form-group">
        <Col>
          <Button type="submit" variant="warning">
            Ignore
          </Button>
        </Col>
      </Form.Group>
    </Form>
  )
}
  

// negates all words with a value equal to or less than value

const IgnoreOperationbyValue = ({ wordcloudId }: { wordcloudId: number }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(OperatingOnWordsbyValue),
  });
  return (
    <Form onSubmit={handleSubmit(onIgnoreValue)}>
      <input type="hidden" {...register('wcid')} value={wordcloudId} />
      <Form.Group>
        <Form.Label>Ignore Words below Value</Form.Label>
        <input
        type="number"
        {...register('threshold')}
        required
        className={`form-control ${errors.threshold ? 'is-invalid' : ''}`}
        />
        <div className="invalid-feedback">{errors.threshold?.message}</div>
      </Form.Group><Form.Group className="form-group">
        <Col>
          <Button type="submit" variant="warning">
            Ignore
          </Button>
        </Col>
      </Form.Group>
    </Form>
  )
}

// removes all words found 
const DeleteOperationbyText = ({ wordcloudId }: { wordcloudId: number }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(OperatingOnWordsbyText),
  });
  return (
    <Form onSubmit={handleSubmit(deleteText)}>
      <input type="hidden" {...register('wcid')} value={wordcloudId} />
      <Form.Group>
        <Form.Label>Words to be Deleted</Form.Label>
        <input
        type="text"
        {...register('words')}
        required
        className={`form-control ${errors.words ? 'is-invalid' : ''}`}
        placeholder="words separated by spaces... Cannot be Undone"
        />
        <div className="invalid-feedback">{errors.words?.message}</div>
      </Form.Group><Form.Group className="form-group">
        <Col>
          <Button type="submit" variant="danger">
            Delete
          </Button>
        </Col>
      </Form.Group>
    </Form>
  )
}

// removes all words with a value equal or less than
const DeleteOperationbyValue = ({ wordcloudId }: { wordcloudId: number }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(OperatingOnWordsbyValue),
  });
  return (
    <Form onSubmit={handleSubmit(deleteLowValue)}>
      <input type="hidden" {...register('wcid')} value={wordcloudId} />
      <Form.Group>
        <Form.Label>Delete Words below Value</Form.Label>
        <input
        type="number"
        {...register('threshold')}
        required
        className={`form-control ${errors.threshold ? 'is-invalid' : ''}`}
        />
        <div className="invalid-feedback">{errors.threshold?.message}</div>
      </Form.Group>
      <Form.Group className="form-group">
        <Col>
          <Button type="submit" variant="danger">
            Delete
          </Button>
        </Col>
      </Form.Group>
    </Form>
  )
}

const OperateWordCloudForm = ({ wc }: { wc: WordCloud }) => {
  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col>
          <Card>
            <Card.Body>
              <IgnoreOperationbyText wordcloudId={wc.id}/>
              <IgnoreOperationbyValue wordcloudId={wc.id}/>
              <DeleteOperationbyText wordcloudId={wc.id}/>
              <DeleteOperationbyValue wordcloudId={wc.id}/>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default OperateWordCloudForm;
