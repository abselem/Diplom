import {React, useState, useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, ListGroup, Image, Row, Col} from 'react-bootstrap'
import { Link } from 'react-router-dom';

const DepositList = () => {

    const [deposits, setDeposits] = useState([]);

    useEffect(() => {
        axios
        .get('http://127.0.0.1:8000/api/v1/deposit_kinds/')
        .then((response) => setDeposits(response.data))
        .catch((error) => console.log(error));
    }, []);


  return (
    <Container>
        {deposits.map((deposit) => (
            <Row className="border border-primary border-0 rounded-5 mt-3 mb-3" style={{background: '#ededed'}}>
                <Col md={6} className="p-5 bg-transparent">
                    <h1>Депозит "{deposit.name}"</h1>
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
                                            <h4>{deposit.min_sum.toLocaleString('ru-RU')} тг</h4>
                                        </div>
                                        <p>минимальная сумма</p>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                        <Link to={`/deposittypes/${deposit.name}`}>
                            <Button className="mt-2">Подробнее</Button>
                        </Link>
                    </div>
                </Col>
                <Col md={6} className="p-5 bg-transparent w-auto mt-auto mb-auto">
                    <Image src={`${'http://127.0.0.1:8000'}${deposit.pict}`} alt='Card' className="mx-auto align-items-center" style={{ display: "block", maxWidth: "400px" }}/>
                </Col>
            </Row> 
        ))}
    </Container>
    
  );
};

export default DepositList;