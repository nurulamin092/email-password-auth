import './App.css';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import app from './firebase.init';
import Form from 'react-bootstrap/Form'
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';


const auth = getAuth(app);

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const handleEmailBlur = (event) => {
    setEmail(event.target.value);
  }
  const handlePasswordBlur = (event) => {
    setPassword(event.target.value);
  }
  const handleFormSubmit = (event) => {

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      }).catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
      })
    console.log(email, password);
    event.preventDefault()
  }
  return (
    <div>
      <div className="registration w-50 mx-auto mt-5">
        <h1 className='text-primary'>Please Register</h1>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>

      </div>
    </div>
  );
}

export default App;
