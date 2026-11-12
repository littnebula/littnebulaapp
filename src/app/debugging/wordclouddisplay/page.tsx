import WordCloudVisualizer from '@/components/WordCloudVisualizer';
import { Card, Col, Container, Row, Table } from 'react-bootstrap';
import { boolean } from 'yup';
// import { Word } from "@isoterik/react-word-cloud";
import { JSX } from 'react/jsx-runtime';

const sampleText: string = 'CHAPTER IX 16. And yet this is not all that the unlimited capacity of my memory stores up. In memory, there are also all that one has learned of the liberal sciences, and has not forgotten--removed still further, so to say, into an inner place which is not a place. Of these things it is not the images that are retained, but the things themselves. For what literature and logic are, and what I know about how many different kinds of questions there are--all these are stored in my memory as they are, so that I have not taken in the image and left the thing outside. It is not as though a sound had sounded and passed away like a voice heard by the ear which leaves a trace by which it can be called into memory again, as if it were still sounding in mind while it did so no longer outside. Nor is it the same as an odor which, even after it has passed and vanished into the wind, affects the sense of smell--which then conveys into the memory the image of the smell which is what we recall and re-create; or like food which, once in the belly, surely now has no taste and yet does have a kind of taste in the memory; or like anything that is felt by the body through the sense of touch, which still remains as an image in the memory after the external object is removed. For these things themselves are not put into the memory. Only the images of them are gathered with a marvelous quickness and stored, as it were, in the most wonderful filing system, and are thence produced in a marvelous way by the act of remembering.';

interface wcd {
    wordcloud: Word[],
    totalwords: number,
    visiblewords: number,
}

interface Word {
  text: string,
  value: number,
  annotation: string
}

function generateWordCloudData(sourceText: string): wcd {
    const words: string[] = sourceText
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // change based on language type
    .split(/\s+/)
    .filter(boolean);
    const wordCountingBuffer: Record<string, number> = words.reduce<Record<string, number>>((acc, word) => {
      acc[word] = (acc[word] ?? 0) + 1;
      return acc;
    }, {});
    const worddata: Word[] = [];
    for (const key of Object.keys(wordCountingBuffer)) {
      worddata.push(
        {
          'text': key,
          'value': wordCountingBuffer[key],
          'annotation': ''
        }
      )
    }
    worddata.sort((a: Word, b: Word)=> b.value - a.value)
    const totalcounter: number = words.length;
    const newWCD: wcd = {
        wordcloud: worddata,
        totalwords: totalcounter,
        visiblewords: 10,
    }
    return newWCD
}


/** The Home page. */
const DebuggingWordCloudDisplay = () => {
  const sampleData: wcd = generateWordCloudData(sampleText)
  //   console.log(sampleData);
  const tablelist: JSX.Element[] | null | undefined = [];
  sampleData.wordcloud.forEach((entry: Word) => {
    tablelist.push(
      <tr key={entry.text}>
        <td>{entry.text}</td>
        <td>{entry.value}</td>
      </tr>
    )
  })
  const formattedData: Word[] = [];
  let visibleTotal: number = 0;
  for (let i: number = 0; i < sampleData.visiblewords; i++) {
    formattedData.push(
      {
        'text': sampleData.wordcloud[i].text,
        'value': sampleData.wordcloud[i].value,
        'annotation': 'some word',
      }
    )
    visibleTotal += sampleData.wordcloud[i].value;
  }
  // console.log(visibleTotal);
  const scaleFactor: number = 1000 / (formattedData[0].value/ visibleTotal)
  for (let i: number = 0; i < sampleData.visiblewords; i++) {
    formattedData[i].value = formattedData[i].value * scaleFactor / visibleTotal;
    visibleTotal += sampleData.wordcloud[i].value;
  }
  // console.log(formattedData);
  return (
    <main>
      <Container id="landing-page" fluid className="py-3">
        <Container>
          <Row className="align-middle text-center">
            <Col className="d-flex flex-column justify-content-center">
              <h1>Showing WordCloud data list for string</h1>
              <p>{sampleText}</p>
            </Col>
          </Row>
          <Row className='justify-content-center'>
            <Card style={{ backgroundColor: '#08031daf', color: '#ffffff' }}>
              <WordCloudVisualizer 
              FormattedWordCloudData={formattedData} />
            </Card>
          </Row>
          <Row>
            <Col md>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Unique Word</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {tablelist}
                </tbody>
              </Table> 
            </Col>
          </Row>
        </Container>
      </Container>
    </main>
    );
};

export default DebuggingWordCloudDisplay;
