import LandingPageListing from '@/components/LandingPageWCListing';
import { Col, Container, Row } from 'react-bootstrap';

/** The Home page. */
const Home = () => (
  <main>
    <Container id="landing-page" fluid className="py-3">
      <Row className="align-middle text-center">
        <Col className="d-flex flex-column justify-content-center">
          <h1>Welcome to the Nebula of Literature</h1>
          <h3>Explore Documented Territories, Discover Unforseen Connections</h3>
          <h3>or Embark on New Voyages</h3> {/* "New Voyages" can be set to link to the generate new wordcloud page */}
        </Col>
      </Row>
      <Row className="my-4"></Row>
      <Row>
        <LandingPageListing />
      </Row>
    </Container>
  </main>
);

export default Home;
