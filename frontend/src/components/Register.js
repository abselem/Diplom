import React, { useState } from 'react';
import Webcam from 'react-webcam';
import { Form, Button, Container } from 'react-bootstrap';
import instance from './axiosInstance';

export default function RegisterWithIIN() {
  const [iin, setIIN] = useState('');
  const [result, setResult] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!capturedImage) return;
    const data = { 'iin': iin, 'image': capturedImage };
    instance.post('face_comparison/', data)
    .then((response) => {
    setResult(response.data.result);
    setShowForm(response.data.result);
    if (!response.data.result) {
    setErrorMessage(response.data.detail);
    }
    })
    .catch((error) => {
    // вывод сообщения об ошибке
    if (error.response && error.response.data && error.response.data.error) {
      alert(error.response.data.error);
    }
    if (error.response.status === 404) {
    setErrorMessage('Неверный ИИН');
    } else {
    console.log(error);
    }
    });
    };

  const handleRegistration = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Пароли не совпадают');
      return;
    }

    const data = {
      password: password,
      email: email,
      iin: iin,
      confirm_password: confirmPassword,
      username: iin
    };

    instance.post('register/', data).then((response) => {
      window.location.href = '/login'
    })
      .catch((error) => {
      if (error.response.status === 400) {
        setErrorMessage('Данный пользователь уже существует');
      } else {
        setErrorMessage('Произошла ошибка. Попробуйте позже.');
      }
    });
  };

  const handleIINChange = (event) => {
    setIIN(event.target.value);
  };


  return (
    <Container style={{ marginTop: '100px', marginBottom: '100px', display: 'flex', justifyContent: 'center'}}>
      {!showForm ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {capturedImage ? (
            <div style={{display: "flex", flexDirection: "column"}}>
                <img src={capturedImage} alt="captured" />
                <Button style={{ marginTop: '1rem', width: '300px' }} variant="primary" onClick={() => setCapturedImage(null)}>
                Сделать другую фотографию
                </Button>
            </div>
            ) : (
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                style={{ width: 300, height: 200 }}
            />
            )}
            <Button style={{ marginTop: '1rem', width: '300px' }} variant="primary" onClick={capture}>
            Сделать снимок
            </Button>
            <Form onSubmit={handleSubmit} style={{ width: '300px', marginTop: '1rem' }}>
              <Form.Group controlId="formBasicEmail">
                  <Form.Label>IIN</Form.Label>
                  <Form.Control type="text" placeholder="Enter IIN" value={iin} onChange={handleIINChange}/>
              </Form.Group>
              <Button variant="primary" type="submit" style={{ width: '70%', marginTop: '10px' }}>Проверка соотвествия</Button>
            </Form>
            {errorMessage && (
              <p style={{ color: 'red', marginTop: '1rem' }}>{errorMessage}</p>
            )}
        </div>
      ) : result ? (
        <Form onSubmit={handleRegistration}>
          <h1>Регистрация</h1>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>ИИН</Form.Label>
            <Form.Control type="text" placeholder="Enter IIN" value={iin} readOnly/>
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Пароль</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </Form.Group>
          <Form.Group controlId="formBasicConfirmPassword">
            <Form.Label>Повторите пароль</Form.Label>
            <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          </Form.Group>
          <Button variant="primary" type="submit" style={{ width: '60%', marginTop: '10px' }}>
            Регистрация
          </Button>
        </Form>
          ) : (
            <div>
              <p style={{ color: 'red' }}>IIN and Photo don't match</p>
              <Button style={{ width: '300px' }} variant="primary" onClick={() => setShowForm(false)}>
                Try Again
              </Button>
            </div>
          )}
    </Container>
  );
}