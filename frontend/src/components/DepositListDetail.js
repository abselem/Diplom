import {React, useState, useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, ListGroup, Image, Row, Col, Form, Alert, Modal} from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import instance from './axiosInstance';

const DepositList = () => {
    const { name } = useParams();
    const [deposit, setDeposit] = useState({});
    const [cardName, setCardName] = useState('');
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    console.log(name)

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

      useEffect(() => {
        axios
          .get(`http://localhost:8000/api/v1/deposit_kinds/${name}/`)
          .then((response) => setDeposit(response.data))
          .catch((error) => console.log(error));
      }, [name]);

      const handleFormSubmit = (e) => {
        e.preventDefault();
    
        instance
          .post("create_deposit/", {
            name: cardName,
            kind: deposit.id,
          })
          .then((response) => {
            console.log(response.data);
            setShowModal(false);
            setError("");
          })
          .catch((error) => {
            console.log(error);
            // вывод сообщения об ошибке
            if (error.response && error.response.data && error.response.data.error) {
              alert(error.response.data.error);
            }
            if (error.response.status === 401) {
              setError("Ошибка");
            }
          });
    };


  return (
    <Container>
        <Row className="border border-primary border-0 rounded-5 mt-3 mb-3" style={{background: '#ededed'}}>
            <Col md={6} className="p-5 bg-transparent">
                <h1>Депозит "{deposit.name}"</h1>
                <p>{deposit.additional_info}</p>
                <div style={{margin: '48px 0', maxwidth: '720px', width: '100%'}}>
                    <ListGroup horizontal>
                        <ListGroup.Item className="border-0 bg-transparent">
                            <div className="description-item">
                                <div className="item">
                                    <div className="with-color">
                                        <h4>{deposit.percent} %</h4>
                                    </div>
                                    <p>годовая ставка</p>
                                </div>
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item className="border-0 bg-transparent">
                            <div className="description-item">
                                <div className="item">
                                    <div>
                                        {deposit.take_off ? (<h4>Есть</h4>) : (<h4>Нету</h4>)}
                                    </div>
                                    <p>
                                        возможность снятия
                                    </p>
                                </div>
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item className="border-0 bg-transparent">
                            <div className="description-item">
                                <div className="item">
                                    <div className="with-color">
                                        <h4>{deposit.min_sum} тг</h4>
                                    </div>
                                    <p>минимальная сумма</p>
                                </div>
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                    {isAuthenticated() && (
                    <div>
                        <Button onClick={() => setShowModal(true)}>Перейти к оформлению</Button>
                    </div>)}
                </div>
            </Col>
            <Col md={6} className="p-5 bg-transparent w-auto mt-auto mb-auto">
                <Image src={`${'http://127.0.0.1:8000'}${deposit.pict}`} alt='Card' className="mx-auto align-items-center" style={{ display: "block", maxWidth: "400px" }}/>
            </Col>
        </Row>

        {showModal && (
            <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Формирование депозита</Modal.Title>
            </Modal.Header>
            <Form>
              <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form.Group>
                  <Form.Label>Название карты</Form.Label>
                  <Form.Control
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Закрыть
                </Button>
                <Button variant="primary" type="submit" onClick={handleFormSubmit}>
                  Отправить
                </Button>
              </Modal.Footer>
            </Form>
            </Modal>
        )}  
    </Container>
    
  );
};

export default DepositList;