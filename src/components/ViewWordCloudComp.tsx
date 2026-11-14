import { Col, Container, Row, Table } from "react-bootstrap";
import { WordCloud, Word } from "@prisma/client";
import WordCloudVisualizer from "./WordCloudVisualizer";
import { getFormattedData } from "@/lib/WordCloudActions";

const WordCloudExaminer = ({wordclouddata, words}: {wordclouddata: WordCloud, words: Word[]}) => {
  return (
    <Container fluid className="py-3">
      <Row>
          <h1>{wordclouddata.title}</h1>
          <h4>Created by {wordclouddata.owner}</h4>
          <h6>[{wordclouddata.createdAt.toLocaleDateString('en-US')}]</h6>
        </Row>
        <Row>          
          <WordCloudVisualizer 
          FormattedWordCloudData={getFormattedData(words, wordclouddata.displayCount)}
          sizing={1.0}/>
        </Row>
        <Row>
          <Col>
            <p>{wordclouddata.description}</p>
          </Col>
        </Row>
        <Row>
          <Col sm>
            <hr/>
            <p>{wordclouddata.bibliography}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>All Words for: {wordclouddata.title} </h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Unique Word</th>
                  <th className="text-start">Count</th>
                  <th className="text-start">Annotation</th>
                </tr>
              </thead>
              <tbody>
                {words.map((w) => (
                  <tr key={w.text}>
                    <td>{w.text}</td>
                    <td className="text-start">{w.value}</td>
                    <td className="text-start">{w.annotation}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
    </Container>
  )
  
};

export default WordCloudExaminer;
