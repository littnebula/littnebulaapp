import WordCloudVisualizer from '@/components/WordCloudVisualizer';
import { Col, Container, Row } from 'react-bootstrap';
import { boolean } from 'yup';

const sampleText: string = '"that" this that! thiss word Word WORD words Wo1r-d';

function generateWordCloudData(sourceText: string): object {
    const words: string[] = sourceText
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(boolean);
    return words.reduce<Record<string, number>>((acc, word) => {
      acc[word] = (acc[word] ?? 0) + 1;
      return acc;
    }, {});
}


/** The Home page. */
const DebuggingWordCloudDisplay = () => {
  console.log(generateWordCloudData(sampleText));
  return (
    <main>
        <Container id="landing-page" fluid className="py-3">
        <Row className="align-middle text-center">
            <Col className="d-flex flex-column justify-content-center">
            <h1>Showing WordCloud data list</h1>
            </Col>
        </Row>
        <Row>
            {/* <WordCloudVisualizer wordclouddata={sampleData} /> */}
        </Row>
        </Container>
    </main>
    );
};

export default DebuggingWordCloudDisplay;
