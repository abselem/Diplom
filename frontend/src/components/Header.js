import {React, useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Nav, Button, Container, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from "styled-components";
import axios from 'axios';


const Styles = styled.div `
  a, .navbar-beand, .navbar-nav .nav-link {
    text-decoration: none;
    color: grey;
    &:hover {
      color: white
    }
  }
`

function Headers() {
  const isAuthenticated = () => {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      return false;
    } else if (accessToken.length > 5) {
      return true;
    } else {
      return false;
    }
  };

  const [bank, setBank] = useState([]);

  useEffect(() => {
    axios
    .get('http://127.0.0.1:8000/api/v1/bank_info/')
    .then((response) => setBank(response.data))
    .catch((error) => console.log(error));
  }, []);

  const handleLogout = () => {
    // удаляем токены из локального хранилища
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // перенаправляем пользователя на страницу входа
    window.location.href = '/';
  };


  return (
    <>
    <Styles>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark"> 
          <Container>
            {!bank.logo ? (
              <Navbar.Brand><Link to="/"><h1>{bank.title}</h1></Link></Navbar.Brand>
            ) : (
              <Navbar.Brand><Link to="/"><Image src={`${'http://127.0.0.1:8000'}${bank.logo}`} style={{ display: "block", maxWidth: "50px" }} /></Link></Navbar.Brand>
            )}
            
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav className = "ms-3"><Link to="/cardtypes">Карты</Link></Nav>
                <Nav className = "ms-3"><Link to="/deposittypes">Депозиты</Link></Nav>
                <Nav className = "ms-3"><Link to="/credittypes">Кредиты</Link></Nav>
                <Nav className = "ms-3"><Link to="/About">о Банке</Link></Nav>
                <Nav className = "ms-3"><Link to="/Currency">Курс валют</Link></Nav>
              </Nav>
              <Nav>
                {isAuthenticated() && (
                  <Nav>
                    <Link className="mt-2" to="/mybank">Профиль</Link>
                    <Button className="ms-3" variant = "primary" onClick={handleLogout}><Link to="/" style={{color: 'white'}}>Выйти</Link></Button>
                  </Nav>
                )}
                {!isAuthenticated() && (
                  <>
                    <Button className="me-3" variant = "primary"><Link to="/login" style={{color: 'white'}}>Войти</Link></Button>
                    <Button variant = "primary"><Link to="/Register" style={{color: 'white'}}>Стать клиентом банка</Link></Button>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container> 
        </Navbar>
        {isAuthenticated() && (
          <Navbar style={{backgroundColor: "#333333"}}>
            <Container>
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Nav className="ms-3">
                    <Link to="/mybank">Мой Банк</Link>
                  </Nav>
                  <Nav className="ms-3">
                    <Link to="/transfertypes">Переводы</Link>
                  </Nav>
                  <Nav className="ms-3">
                    <Link to="/PayList">Платежи</Link>
                  </Nav>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        )} 
      </Styles>
    </>
  );
}

export default Headers;