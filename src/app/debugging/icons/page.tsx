import DynamicIcon, { ICON_DICTIONARY } from "@/components/DynamicIconDisplay";
import { Container} from "react-bootstrap";

const DebuggingSpace = () => {
  return (
    <Container>
      {Object.keys(ICON_DICTIONARY).map((ico) => (
        <DynamicIcon 
        key={ico}
        name={ico}
        size={24}
        strokeWidth={1.6}
        />
      ))}
      
    </Container>
  );
};

export default DebuggingSpace;
