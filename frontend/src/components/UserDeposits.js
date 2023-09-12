import {React, useState, useEffect} from "react";
import {Col, Container, Image, Row, Alert, Button, Form, Modal, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import instance from './axiosInstance';


const UserDeposits = () => {

    const [deposit, setDeposit] = useState([]);
    const [card, setCard] = useState();
    const [showModalBetweenYourth, setShowModalBetweenYourth] = useState(false);
    const [showModalHistory, setShowModalHistory] = useState(false);
    const [sum, setSum] = useState("");
    const [data_sender, setDataSender] = useState();
    const [table_data_sender, setTableDataSender] = useState(true);
    const [data_getter, setDataGetter] = useState();
    const [table_data_getter, setTableDataGetter] = useState(false);

    useEffect(() => {
        instance
          .get('user_deposit_info/')
          .then((response) => {
            setDeposit(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);

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
          .get('card_transfer_deposit_history_sender/')
          .then((response) => {
            setDataSender(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);

      useEffect(() => {
        instance
          .get('card_transfer_deposit_history_getter/')
          .then((response) => {
            setDataGetter(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);

    const [showAlert, setShowAlert] = useState(false);
    const handleSumChange = (event) => {
        setSum(event.target.value);
        event.preventDefault();
        // Проверяем, что сумма в допустимых границах
        if (sum >= 100 && sum <= card.sum) {
          // Отправляем данные на сервер
          console.log("Данные отправлены:", { sum });
        } else {
          // Показываем оповещение
          setShowAlert(true);
        }
      };


    const handleFormSubmit1 = (e) => {
        e.preventDefault();
    
        instance
          .post("card_to_deposit_transfer/", {
            sender_card: card.id,
            recipient_deposit: deposit.id,
            amount: sum,
            from_card: false
          })
          .then((response) => {
            console.log(response.data);
            if (response.status === 201) {
              window.location.href = '/mybank'
            }
          })
          .catch((error) => {
            console.log(error);
            // вывод сообщения об ошибке
            if (error.response && error.response.data && error.response.data.error) {
              alert(error.response.data.error);
            }
          });
      };

    const formatDate = (datetimeString) => {
        const datetime = new Date(datetimeString);
        const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' };
        const formattedDate = datetime.toLocaleString('ru-RU', options);
        return formattedDate;
      }

    return (
        <Container>
            <h1>Депозиты: </h1>
            {deposit ? (
                <Row className=" border-primary border-0 rounded-5 my-3 p-3" style={{background: '#ededed'}}>
                    {deposit.deposit_kind && deposit.deposit_kind.pict && (
                    <div className="bg-transparent w-auto mt-auto mb-auto">
                        <Image src={`${'http://127.0.0.1:8000'}${deposit.deposit_kind.pict}`} style={{ display: "block", maxWidth: "120px" }}/>
                    </div>
                    )}
                    <div className="bg-transparent w-max ms-auto me-auto" style={{width: "max-content", height: "auto"}}>
                        <Row>
                            <h3 style={{textAlign: 'center'}}>{deposit.name}</h3>
                        </Row>
                        <Row>
                            <Col>
                                <div style={{width:"max-content"}}>
                                    <p className="m-0">Ставка:  </p>
                                    {deposit.deposit_kind && deposit.deposit_kind.percent && (
                                    <h5 className="m-0"> {deposit.deposit_kind.percent} %</h5>
                                    )}
                                </div>
                            </Col>
                            <Col>
                                <div style={{width:"max-content"}}>
                                    <p className="m-0">Накоплено: </p>
                                    <h5 className="m-0">{deposit.sum} тг</h5>
                                </div>
                            </Col>
                            <Col>
                                <div style={{width:"max-content"}}>
                                    <p className="m-0">Можно снимать: </p>
                                    {deposit.is_active ? (<h5 className="m-0">ДА</h5>) : (<h5 className="m-0">НЕТ</h5>)}
                                </div>
                            </Col>
                        </Row>
                        <Row className="my-2">
                            {deposit.is_active && (
                            <Col>
                                <div>
                                <Button className="border border-3 rounded-5 mt-2 my-3 p-3" variant="primary" style={{
                                                                 width: 'max-content',
                                                                 color: "black",
                                                                 background: "white",
                                                                 border: "2px solid black",
                                                                 transition: "all 0.3s ease-in-out"}} 
                                                                 onClick={() => setShowModalBetweenYourth(true)}>
                                  <div style={{ display: "flex", alignItems: "center"}}>
                                    <p className="ms-3" style={{display: 'contents'}}>Снятие на карту</p>
                                  </div>
                                </Button>
                                </div>
                            </Col>)}
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
                </Row>
            ) : (
                <h5>У вас нету депозита</h5>
            )}

            {showModalBetweenYourth && (
                <Modal show={showModalBetweenYourth} onHide={() => setShowModalBetweenYourth(false)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Между своими счетами</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleFormSubmit1}>
                            <Form.Group>
                              <Form.Label>С депозита</Form.Label>
                              <Form.Control
                                as="select"
                                required
                              >
                                <option>{deposit.name}  -- {deposit.sum} тг</option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formFromAccount">
                              <Form.Label>На карту</Form.Label>
                              <Form.Control
                                as="select"
                                required
                              >
                                <option >{card.name} -- {card.sum} тг</option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Сумма</Form.Label>
                              <Form.Control
                                type="number"
                                required
                                min={100}
                                max={deposit.sum}
                                value={sum}
                                onChange={handleSumChange}
                              />
                              {showAlert && (
                                <Alert variant="danger">
                                  Сумма должна быть не меньше 100 и не больше {deposit.sum}
                                </Alert>
                              )}
                            </Form.Group>
                            <Button className="mt-2" variant="primary" type="submit">
                              Перевод
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>)
            }
            {showModalHistory && (
                <Modal show={showModalHistory} onHide={() => setShowModalHistory(false)}>
                    <Modal.Header closeButton>
                      <Modal.Title>История</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Button onClick={() => { setTableDataSender(true); setTableDataGetter(false); }}>Пополнение</Button>
                        <Button className="ms-3" onClick={() => { setTableDataSender(false); setTableDataGetter(true); }}>Снятие</Button>
                        {table_data_sender && (
                        <Table>
                            <thead>
                              <tr>
                                <th>Дата</th>
                                <th>Сумма</th>
                                <th>Операция</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data_sender.map((item, index) => (
                                <tr key={index}>
                                    <td>{formatDate(item.created_at)}</td>
                                    <td>{item.amount}</td>
                                    <td>{item.message}</td>
                                </tr>
                              ))}
                            </tbody>
                        </Table>
                        )}
                        {table_data_getter && (
                        <Table>
                            <thead>
                              <tr>
                                <th>Дата</th>
                                <th>Сумма</th>
                                <th>Операция</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data_getter.map((item, index) => (
                                <tr key={index}>
                                    <td>{formatDate(item.created_at)}</td>
                                    <td>{item.amount}</td>
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

export default UserDeposits;