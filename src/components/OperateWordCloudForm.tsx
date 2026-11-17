'use client';
import { deleteLowValue, deleteText, onIgnoreValue, onIgnoreText, reEnableText, reEnableValue } from "@/lib/dbActions";
import { OperatingOnWordsbyText, OperatingOnWordsbyValue } from "@/lib/validationSchemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { WordCloud } from "@prisma/client";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useForm } from 'react-hook-form';
import { usePathname } from "next/navigation";

// negates all words found in words for the current 
const IgnoreOperationbyText = ({ wordcloudId, pagepath }: { wordcloudId: number, pagepath: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(OperatingOnWordsbyText),
  });
  return (
    <Form onSubmit={handleSubmit(onIgnoreText)}>
      <input type="hidden" {...register('wcid')} value={wordcloudId} />
      <input type="hidden" {...register('pagepath')} value={pagepath} />
      <Form.Group>
        <Form.Label>Words to be Ignored</Form.Label>
        <input
        type="text"
        {...register('words')}
        required
        className={`form-control ${errors.words ? 'is-invalid' : ''} bg-dark text-light`}
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
const IgnoreOperationbyValue = ({ wordcloudId, pagepath }: { wordcloudId: number, pagepath: string }) => {
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
      <input type="hidden" {...register('pagepath')} value={pagepath} />
      <Form.Group>
        <Form.Label>Ignore Words below Value</Form.Label>
        <input
        type="number"
        {...register('threshold')}
        required
        className={`form-control ${errors.threshold ? 'is-invalid' : ''} bg-dark text-light`}
        min={1}
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

// negates all words found in words for the current 
const EnableOperationbyText = ({ wordcloudId, pagepath }: { wordcloudId: number, pagepath: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(OperatingOnWordsbyText),
  });
  return (
    <Form onSubmit={handleSubmit(reEnableText)}>
      <input type="hidden" {...register('wcid')} value={wordcloudId} />
      <input type="hidden" {...register('pagepath')} value={pagepath} />
      <Form.Group>
        <Form.Label>Words to be Enabled</Form.Label>
        <input
        type="text"
        {...register('words')}
        required
        className={`form-control ${errors.words ? 'is-invalid' : ''} bg-dark text-light`}
        placeholder="words separated by spaces..."
        />
        <div className="invalid-feedback">{errors.words?.message}</div>
      </Form.Group>
      <Form.Group className="form-group">
        <Col>
          <Button type="submit" variant="success">
            Enable
          </Button>
        </Col>
      </Form.Group>
    </Form>
  )
}

// negates all words with a value equal to or less than value
const EnableOperationbyValue = ({ wordcloudId, pagepath }: { wordcloudId: number, pagepath: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(OperatingOnWordsbyValue),
  });
  return (
    <Form onSubmit={handleSubmit(reEnableValue)}>
      <input type="hidden" {...register('wcid')} value={wordcloudId} />
      <input type="hidden" {...register('pagepath')} value={pagepath} />
      <Form.Group>
        <Form.Label>Enable Words below Value</Form.Label>
        <input
        type="number"
        {...register('threshold')}
        required
        className={`form-control ${errors.threshold ? 'is-invalid' : ''} bg-dark text-light`}
        max={0}
        />
        <div className="invalid-feedback">{errors.threshold?.message}</div>
      </Form.Group><Form.Group className="form-group">
        <Col>
          <Button type="submit" variant="success">
            Enable
          </Button>
        </Col>
      </Form.Group>
    </Form>
  )
}

// removes all words found 
const DeleteOperationbyText = ({ wordcloudId, pagepath }: { wordcloudId: number, pagepath: string }) => {
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
      <input type="hidden" {...register('pagepath')} value={pagepath} />
      <Form.Group>
        <Form.Label>Words to be Deleted</Form.Label>
        <input
        type="text"
        {...register('words')}
        required
        className={`form-control ${errors.words ? 'is-invalid' : ''} bg-dark text-light`}
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
const DeleteOperationbyValue = ({ wordcloudId, pagepath }: { wordcloudId: number, pagepath: string }) => {
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
      <input type="hidden" {...register('pagepath')} value={pagepath} />
      <Form.Group>
        <Form.Label>Delete Words below Value</Form.Label>
        <input
        type="number"
        {...register('threshold')}
        required
        className={`form-control ${errors.threshold ? 'is-invalid' : ''} bg-dark text-light`}
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
  const pagepath: string = usePathname();
  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col>
          <Card id="darkcard1">
            <Card.Header className="text-center">
              <h2>Word Operations</h2>
            </Card.Header>
            <Card.Body>
              <IgnoreOperationbyText wordcloudId={wc.id} pagepath={pagepath}/>
              <IgnoreOperationbyValue wordcloudId={wc.id} pagepath={pagepath}/>
              <EnableOperationbyText wordcloudId={wc.id} pagepath={pagepath}/>
              <EnableOperationbyValue wordcloudId={wc.id} pagepath={pagepath}/>
              <DeleteOperationbyText wordcloudId={wc.id} pagepath={pagepath}/>
              <DeleteOperationbyValue wordcloudId={wc.id} pagepath={pagepath}/>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default OperateWordCloudForm;
