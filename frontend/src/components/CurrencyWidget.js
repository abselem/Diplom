import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import instance from './axiosInstance';

function CurrencyWidget() {
  const [currencyData, setCurrencyData] = useState([]);

  useEffect(() => {
    instance
      .get('currency/')
      .then((response) => {
        setCurrencyData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Container className="d-flex justify-content-center align-items-center">
        <Table className='mt-3 mb-5' style={{maxWidth: "350px"}} striped bordered hover>
        <thead>
            <tr>
            <th>Наименование</th>
            <th>Продажа</th>
            <th>Покупка</th>
            </tr>
        </thead>
        <tbody>
            {Object.entries(currencyData).map(([key, value]) => (
            <tr key={key}>
                <td>{key.toUpperCase()}</td>
                <td>{value[1]}</td>
                <td>{value[0]}</td>
            </tr>
            ))}
        </tbody>
        </Table>
    </Container>
  );
}

export default CurrencyWidget;