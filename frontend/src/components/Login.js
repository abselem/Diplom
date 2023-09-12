import React, { useState } from 'react';
import axios from 'axios';
import { Button, FormGroup, FormControl, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://127.0.0.1:8000/api/token/', { email, password });
      // сохраняем токены в локальном хранилище
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      // добавляем токен в headers
      axios.defaults.headers.common.Authorization = `Bearer ${data.access}`;
      // перенаправляем пользователя на домашнюю страницу
      window.location.href = '/'
    } catch (error) {
      setError(error.response.data.detail);
      // вывод сообщения об ошибке
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <div className="Login container-fluid p-5" >
        <div className="row justify-content-center">
            <form  className="col-3" onSubmit={handleSubmit}>
                {error && <Alert>Неверные данные</Alert>}
                <h3 className=" text-center">Log in</h3>
                <FormGroup controlId="email" className="mt-3">
                    <label>Email</label>
                    <FormControl
                        autoFocus
                        type="text"
                        value={email} 
                        onChange={handleEmailChange} 
                        required
                        style={{maxWidth: "400px"}}
                    />
                </FormGroup>
                <FormGroup controlId="password" className="mt-3">
                    <label>Password</label>
                    <FormControl
                        value={password} 
                        onChange={handlePasswordChange}
                        required
                        type="password"
                        style={{maxWidth: "400px"}}
                    />
                </FormGroup >
                <Button className="mt-3"
                    type="submit"
                >
                    Login
                </Button>
            </form>
        </div>
    </div>
  );
};

export default LoginForm;