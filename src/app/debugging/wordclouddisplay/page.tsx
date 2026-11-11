import WordCloudVisualizer from '@/components/WordCloudVisualizer';
import { Col, Container, Row } from 'react-bootstrap';


const sampleData: object = {
    "this": 1,
    "that": 2,
    "thiss": 3,
    "Word": 10,
}


/** The Home page. */
const DebuggingWordCloudDisplay = () => (
  <main>
    <Container id="landing-page" fluid className="py-3">
      <Row className="align-middle text-center">
        <Col className="d-flex flex-column justify-content-center">
          <h1>Showing WordCloud data list</h1>
        </Col>
      </Row>
      <Row>
        <WordCloudVisualizer wordclouddata={sampleData} />
      </Row>
    </Container>
  </main>
);

export default DebuggingWordCloudDisplay;
