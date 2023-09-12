import {React, useState, useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, ListGroup, Image, Row, Col} from 'react-bootstrap'
import { Link } from 'react-router-dom';

const CardList = () => {

    const [cards, setCards] = useState([]);

    useEffect(() => {
        axios
        .get('http://127.0.0.1:8000/api/v1/card_kinds/')
        .then((response) => setCards(response.data))
        .catch((error) => console.log(error));
    }, []);


  return (
    <Container>
        {cards.map((card) => (
            <Row className="border border-primary border-0 rounded-5 mt-3 mb-3" style={{background: '#ededed'}}>
                <Col className="p-5 bg-transparent">
                    <h1>Карта "{card.name}"</h1>
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
                                        <div className="with-color ">
                                            <Image src={`${'http://127.0.0.1:8000'}${card.payment_sys.image}`} alt='Card' className="mx-auto align-items-center" style={{ display: "block", maxWidth: "100px", maxHeight: "100px" }}/>
                                        </div>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                        <Link to={`/cardtypes/${card.name}`}>
                            <Button className="mt-2">Подробнее</Button>
                        </Link>
                    </div>
                </Col>
                <Col className="p-5 bg-transparent w-auto mt-auto mb-auto">
                    <Image src={`${'http://127.0.0.1:8000'}${card.pict}`} alt='Card' className="mx-auto align-items-center" style={{ display: "block", maxWidth: "400px" }}/>
                </Col>
            </Row> 
        ))}
    </Container>
  );
};

export default CardList;