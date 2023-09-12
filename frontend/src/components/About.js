import {React, useEffect, useState} from "react";
import { Container, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";



export const About = () => {
  const [bank, setBank] = useState([]);

  useEffect(() => {
    axios
    .get('http://127.0.0.1:8000/api/v1/bank_info/')
    .then((response) => setBank(response.data))
    .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <Container>
          <h1 style={{textAlign: 'center'}}>{bank.title}</h1>
          <div>
            <Image src={`${'http://127.0.0.1:8000'}${bank.logo}`} className="mx-auto mb-3" style={{ display: "block", maxWidth: "300px" }}/>
          </div>
          <p>
            {bank.additional_info}
          </p>
      </Container>
    </>
  );
};  

export default About;