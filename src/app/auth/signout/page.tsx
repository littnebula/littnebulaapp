'use client';

import { signOut } from 'next-auth/react'; // v5 compatible
import { Button, Col, Row } from 'react-bootstrap';

/** After the user clicks the "SignOut" link in the NavBar, log them out and display this page. */
const SignOut = () => (
  <Col id="signout-page" className="text-center py-3">
    <h2>Do you want to sign out?</h2>
    <Row>
      <Col xs={4} />
      <Col>
        <Button
          className="text-light shadow"
          style={{
            backgroundColor: 'rgba(139, 0, 0, 0.85)',
            border: '1px solid #8b0000',
          }}
          onClick={() => signOut({ callbackUrl: '/', redirect: true })}
        >
          Sign Out
        </Button>
      </Col>
      <Col>
        <Button
          href="/"
          className="text-light shadow"
          style={{
            backgroundColor: 'rgba(52, 58, 64, 0.9)',
            border: '1px solid #6c757d',
          }}
        >
          Cancel
        </Button>
      </Col>
      <Col xs={4} />
    </Row>
  </Col>
);

export default SignOut;
