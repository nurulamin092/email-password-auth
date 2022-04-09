import './App.css';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import app from './firebase.init';
import Form from 'react-bootstrap/Form'
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
const auth = getAuth(app);

function App() {

  const [registered, setRegistered] = useState(false);
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailBlur = (event) => {
    setEmail(event.target.value);
  }

  const handlePasswordBlur = (event) => {
    setPassword(event.target.value);
  }
  const handleRegisteredChange = (event) => {
    setRegistered(event.target.checked);
  }
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }

    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      setError('Password should contain at list one special character');
      return;
    }

    setValidated(true);
    setError('')
    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
        }).catch((error) => {
          const errorMessage = error.message;
          console.log(errorMessage)
          setError(errorMessage);
        })
    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          setEmail('');
          setPassword('');
          emailVerification()
        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError(errorMessage)
          console.log(errorCode);
        })
    }
    event.preventDefault()
  }
  const emailVerification = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('Email is send');
      })
  }

  return (
    <div>
      <div className="registration w-50 mx-auto mt-5">
        <h1 className='text-primary'>Please {registered ? 'Login' : 'Register'} </h1>
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
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Already registered?" />
          </Form.Group>
          <p className='text-danger'>{error}</p>
          <Button variant="primary" type="submit">
            {registered ? 'Login' : 'Register'}
          </Button>
        </Form>

      </div>
    </div>
  );
}

export default App;
