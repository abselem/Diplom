import {React, useState, useEffect} from "react";
import {Col, Container, Image, Row, Modal, Table, Button} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import instance from './axiosInstance';



const UserCards = () => {
    const [card, setCard] = useState([]);
    const [showModalHistory, setShowModalHistory] = useState(false);
    const [card_sender, setCardSender] = useState();
    const [card_getter, setCardGetter] = useState();
    const [table_card_sender, setTableCardSender] = useState(true);
    const [table_card_getter, setTableCardGetter] = useState(false);

    useEffect(() => {
        instance
          .get('user_card_info/')
          .then((response) => {
            setCard(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);

      useEffect(() => {
        instance
          .get('card_transfer_history_sender/')
          .then((response) => {
            setCardSender(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);

      useEffect(() => {
        instance
          .get('card_transfer_history_getter/')
          .then((response) => {
            setCardGetter(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);

      const formatDate = (datetimeString) => {
        const datetime = new Date(datetimeString);
        const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' };
        const formattedDate = datetime.toLocaleString('ru-RU', options);
        return formattedDate;
      }

    return (
        <Container>
            <h1>Карты: </h1>
            {card ? (
                <div>
                <Row className="border border-primary border-0 rounded-5 my-3 p-3" style={{background: '#ededed'}}>
                    <div className="bg-transparent w-auto mt-auto mb-auto">
                        {card.kind && card.kind.pict && (
                          <Image src={`${'http://127.0.0.1:8000'}${card.kind.pict}`} style={{ display: "block", maxWidth: "170px" }}/>
                        )}
                    </div>
                    <div className="bg-transparent w-max ms-auto me-auto" style={{width: "max-content", height: "auto"}}>
                        <Row>
                            <h1 style={{textAlign: 'center'}}>{card.name}</h1>
                        </Row>
                        <Row>
                            {card.card_num && (
                                <h3>{card.card_num.replace(/(\d{4})/g, "$1 ")}</h3>)
                            }
                        </Row>
                        <Row>
                            <Col>
                                <div style={{width:"max-content", display:"flex"}}>
                                    <p>date:  </p>
                                    <h5> {card.expiration_date}</h5>
                                </div>
                            </Col>
                            <Col>
                                <div style={{width:"max-content", display:"flex"}}>
                                    <p>CVV: </p>
                                    <h5>{card.cvv}</h5>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div>
                                <Button className="border border-3 rounded-5 mt-2 my-3 p-3" variant="primary" style={{
                                                                 width: 'max-content',
                                                                 color: "black",
                                                                 background: "white",
                                                                 border: "2px solid black",
                                                                 transition: "all 0.3s ease-in-out"}} 
                                                                 onClick={() => window.location.href='/transfertypes'}>
                                  <div style={{ display: "flex", alignItems: "center"}}>
                                    <p className="ms-3" style={{display: 'contents'}}>Переводы</p>
                                  </div>
                                </Button>
                                </div>
                            </Col>
                            <Col>
                                <div>
                                <Button className="border border-3 rounded-5 mt-2 my-3 p-3" variant="primary" style={{
                                                                 width: 'max-content',
                                                                 color: "black",
                                                                 background: "white",
                                                                 border: "2px solid black",
                                                                 transition: "all 0.3s ease-in-out"}} 
                                                                 onClick={() => setShowModalHistory(true)}>
                                  <div style={{ display: "flex", alignItems: "center"}}>
                                    <p className="ms-3" style={{display: 'contents'}}>История</p>
                                  </div>
                                </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="bg-transparent w-auto mt-auto mb-auto">
                        <Row>
                            <div className="d-inline">
                                <p className="m-0">
                                    <h5>Общая сумма:</h5> 
                                </p>
                                {card.sum && (
                                    <p className="m-0">
                                        {card.sum.toLocaleString("en-US", { minimumFractionDigits: 1 })} тг
                                    </p>
                                )}
                            </div>
                        </Row>
                    </div>
                </Row>
                </div>
            ) : (<h5> У вас нету карт </h5>)}
            {showModalHistory && (
                <Modal show={showModalHistory} onHide={() => setShowModalHistory(false)}>
                    <Modal.Header closeButton>
                      <Modal.Title>История</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Button onClick={() => { setTableCardSender(true); setTableCardGetter(false); }}>Переводы</Button>
                        <Button className="ms-3" onClick={() => { setTableCardSender(false); setTableCardGetter(true); }}>Пополнение</Button>
                        {table_card_sender && (
                        <Table>
                            <thead>
                              <tr>
                                <th>Дата</th>
                                <th>Сумма</th>
                                <th>Кому</th>
                                <th>Сообщение</th>
                              </tr>
                            </thead>
                            <tbody>
                              {card_sender.map((item, index) => (
                                <tr key={index}>
                                    <td>{formatDate(item.created_at)}</td>
                                    <td>{item.amount}</td>
                                    <td>{item.recipient.card_num.replace(/(\d{4})/g, "$1 ")}</td>
                                    <td>{item.message}</td>
                                </tr>
                              ))}
                            </tbody>
                        </Table>
                        )}
                        {table_card_getter && (
                        <Table>
                            <thead>
                              <tr>
                                <th>Дата</th>
                                <th>Сумма</th>
                                <th>От кого</th>
                                <th>Сообщение</th>
                              </tr>
                            </thead>
                            <tbody>
                              {card_getter.map((item, index) => (
                                <tr key={index}>
                                    <td>{formatDate(item.created_at)}</td>
                                    <td>{item.amount}</td>
                                    <td>{item.sender.card_num.replace(/(\d{4})/g, "$1 ")}</td>
                                    <td>{item.message}</td>
                                </tr>
                              ))}
                            </tbody>
                        </Table>
                        )}
                    </Modal.Body>
                </Modal>
            )}
        </Container>
    )
};

export default UserCards;