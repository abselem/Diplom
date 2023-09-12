import {React, useState, useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, ListGroup, Image, Row, Col, Modal, Form, Alert } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import instance from './axiosInstance';


function CardListDetail() {
    const { name } = useParams();
    const [card, setCard] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [cardName, setCardName] = useState('');
    const [error, setError] = useState("");
    console.log(showModal)

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

    const handleFormSubmit = (e) => {
        e.preventDefault();
    
        instance
          .post("create_card/", {
            name: cardName,
            kind: card.id,
            first_num: card.payment_sys.first_num
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
    
        setCardName("");
    };
      

    useEffect(() => {
        axios
          .get(`http://localhost:8000/api/v1/card_kinds/${name}/`)
          .then((response) => setCard(response.data))
          .catch((error) => console.log(error));
      }, [name]);

      console.log(card);


  return (
    <Container>
        <Row className="border border-primary border-0 rounded-5 mt-3 mb-3" style={{background: '#ededed'}}>
            <Col className="p-5 bg-transparent">
                <h1>Карта "{card.name}"</h1>
                <p>{card.additional_info}</p>
                <div style={{margin: '48px 0', maxwidth: '720px', width: '100%'}}>
                    <ListGroup horizontal>
                        <ListGroup.Item className="border-0 bg-transparent">
                            <div className="description-item">
                                {!card.paid ? (
                                <div className="item">
                                        <div className="with-color">
                                            <h4>Бесплатная карта</h4>
                                        </div>
                                        <p>без годового обслуживания</p>
                                </div>) : (
                                <div className="item">
                                    <div className="with-color">
                                        <h4> Платная карта</h4>
                                    </div>
                                    <p>с годовым обслуживанием</p>
                                </div>
                                )}
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item className="border-0 bg-transparent">
                            <div className="description-item">
                                <div className="item">
                                    <div>
                                        {card.virtual && (<h4>Виртуальная карта</h4>)}
                                        {!card.virtual && (<h4>Физическая карта</h4>)}
                                    </div>
                                    <p>
                                        в приложении моментально
                                    </p>
                                </div>
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item className="border-0 bg-transparent">
                            <div className="description-item">
                                <div className="item">
                                    <div className="with-color">
                                    {card.payment_sys && (
                                    <Image
                                        src={`${'http://127.0.0.1:8000'}${card.payment_sys.image}`}
                                        alt='Card'
                                        className="mx-auto align-items-center"
                                        style={{ display: "block", maxWidth: "100px", maxHeight: "100px" }}
                                    />
                                    )}
                                    </div>
                                </div>
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                    {isAuthenticated() && (
                        <div>
                            <Button onClick={() => setShowModal(true)}>Перейти к оформлению</Button>
                        </div>
                        
                    )}
                </div>
            </Col>
            <Col className="p-5 bg-transparent w-auto mt-auto mb-auto">
                <Image src={`${'http://127.0.0.1:8000'}${card.pict}`} alt='Card' className="mx-auto align-items-center" style={{ display: "block", maxWidth: "400px" }}/>
            </Col>
        </Row>
        <Row>
            {showModal && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Введите имя карты</Modal.Title>
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
        </Row>
    </Container>
  );
};

export default CardListDetail;