'use client';

import { signIn } from 'next-auth/react'; // v5 compatible
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

/** The sign in page. */
const SignIn = () => {
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;
    await signIn('credentials', {
      callbackUrl: '/myprofile',
      email,
      password,
    });
  };

  return (
    <main>
      <Container>
        <Row className="justify-content-center">
          <Col xs={10} md={6} lg={5}>
            <h1 className="text-center">Sign In</h1>
            <Card
              className="text-light border-secondary"
              style={{
                backgroundColor: 'rgba(20, 20, 20, 0.65)',
              }}
            >
              <Card.Body>
                <Form method="post" onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <input
                      name="email"
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <input
                      name="password"
                      type="password"
                      className="form-control bg-dark text-light border-secondary"
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    className="mt-3 text-light shadow"
                    style={{
                      backgroundColor: 'rgba(0, 65, 130, 0.9)',
                      border: '1px solid #004182',
                    }}
                  >
                    Signin
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer
                className="text-light border-secondary"
                style={{
                  backgroundColor: 'rgba(20, 20, 20, 0.65)',
                }}
              >
                Don&apos;t have an account?{' '}
                <a href="/auth/signup">Sign up</a>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignIn;
