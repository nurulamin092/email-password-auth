import './App.css';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from './firebase.init';
import Form from 'react-bootstrap/Form'
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
const auth = getAuth(app);

function App() {

  const [registered, setRegistered] = useState(false);
  const [validated, setValidated] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('')
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleNameBlur = (event) => {
    setName(event.target.value)
  }

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
          const successMessage = 'Login success';
          setSuccess(successMessage);

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
          emailVerification();
          setUserName();

        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError(errorMessage)
          console.log(errorCode);
        })
    }
    event.preventDefault()
  }
  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name
    })
      .then(() => {
        console.log('update profile name');
      }).catch((error) => {
        setError(error.message);
      })
  }
  const emailVerification = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('Email is send');
      })
  }
  const handelForgetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('send password email');
      })
  }

  return (
    <div>
      <div className="registration w-50 mx-auto mt-5">
        <h1 className='text-primary'>Please {registered ? 'Login' : 'Register'} </h1>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>

          {!registered && <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name </Form.Label>
            <Form.Control onBlur={handleNameBlur} type="text" placeholder="Your email" required />
            <Form.Control.Feedback type="invalid">
              Please provide your name .
            </Form.Control.Feedback>
          </Form.Group>}
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
          <p className='text-success'>{success}</p>
          <p className='text-danger'>{error}</p>
          <Button onClick={handelForgetPassword} variant='link'>
            Forget Password?
          </Button>
          <br />
          <Button variant="primary mt-1" type="submit">
            {registered ? 'Login' : 'Register'}
          </Button>
        </Form>

      </div>
    </div>
  );
}

export default App;
