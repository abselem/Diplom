import "./Footer.css";
import {React, useState, useEffect} from "react";
import {Col, Container, Image, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import axios from 'axios';


export default function Footer() {

  const [bank, setBank] = useState([]);

  useEffect(() => {
    axios
    .get('http://127.0.0.1:8000/api/v1/bank_info/')
    .then((response) => setBank(response.data))
    .catch((error) => console.log(error));
  }, []);


  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: "#212121",
        width: "auto",
        Height: "auto",
        paddingLeft: "100px",
        paddingRight: "100px",
        paddingTop: "50px",
      }}
    >
      <Container>
      <footer className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5 mt-5 border-top">
          <Row className="col mb-3">
            <Col>
              <Image src={`${'http://127.0.0.1:8000'}${bank.logo}`} className="mx-auto mb-3" style={{ display: "block", maxWidth: "100px" }}/>
            </Col>
            <Col className="text-a">
              {bank.title} © 2023
            </Col>
          </Row>

          <Row className="col mb-4"></Row>

          <Row className="col mb-4">
            <Col className="text-a">
              <h3>Для связи:</h3>
                <a
                  href={bank.email}
                  style={{ color: "white", textDecoration: "none" }}
                >
                  <p> {bank.email}</p>
                </a>
                <p>Call-center  :</p>
                <p>{bank.call_center_phone1}</p>
                <p>{bank.call_center_phone2}</p>
            </Col>
          </Row>

          <Row className="col mb-4"></Row>

          <Row className="col mb-4">
            <Col className="text-a">
              <h2>Адрес:</h2>
              <h3> г. {bank.address} </h3>
            </Col>
          </Row>
      </footer>
      </Container>
    </div>
  );
}
