import { getColorOptions } from "@/lib/WordCloudActions";
import { Container } from "react-bootstrap";
import { SquareFill } from "react-bootstrap-icons";


const debuggingSpace = () => {
  return (
    <Container>
      {getColorOptions().map((color, idx) => (
        <SquareFill key={idx} style={{ color: color}}></SquareFill>
      ))}
    </Container>
)};

export default debuggingSpace;