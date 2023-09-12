import {React, useState, useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, ListGroup, Image, Row, Col} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CreditList = () => {
    const [credits, setCards] = useState([]);

    useEffect(() => {
        axios
        .get('http://127.0.0.1:8000/api/v1/credit_kinds/')
        .then((response) => setCards(response.data))
        .catch((error) => console.log(error));
    }, []);


  return (
    <Container>
        {credits.map((credit) => (
            <Row className="border border-primary border-0 rounded-5 mt-3 mb-3" style={{background: '#ededed'}}>
                <Col md={6} className="p-5 bg-transparent">
                    <h1>Кредит "{credit.name}"</h1>
                    <div style={{margin: '48px 0', maxwidth: '720px', width: '100%'}}>
                        <ListGroup horizontal>
                            <ListGroup.Item className="border-0 bg-transparent">
                                <div className="description-item">
                                    <div className="item">
                                        <div className="with-color">
                                            <h4>{credit.percent} %</h4>
                                        </div>
                                        <p>годовая ставка</p>
                                    </div>
                                </div>
                            </ListGroup.Item>
                            <ListGroup.Item className="border-0 bg-transparent">
                                <div className="description-item">
                                    <div className="item">
                                        <div>
                                            <h4>{credit.max_sum.toLocaleString('ru-RU')} тг</h4>
                                        </div>
                                        <p>
                                            максимальная сумма
                                        </p>
                                    </div>
                                </div>
                            </ListGroup.Item>
                            <ListGroup.Item className="border-0 bg-transparent">
                                <div className="description-item">
                                    <div className="item">
                                        <div className="with-color">
                                            <h4>до {credit.max_year} лет</h4>
                                        </div>
                                        <p>срок кредитования</p>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                        <Link to={`/credittypes/${credit.name}`}>
                            <Button className="mt-2">Подробнее</Button>
                        </Link>
                    </div>
                </Col>
                <Col md={6} className=" p-5 bg-transparent w-auto mt-auto mb-auto">
                    <Image src={`${'http://127.0.0.1:8000'}${credit.pict}`} alt='Card' className="mx-auto align-items-center" style={{ display: "block", maxWidth: "400px" }}/>
                </Col>
            </Row> 
        ))}
    </Container>
    
  );
};

export default CreditList;