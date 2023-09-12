import {React, useState, useEffect} from 'react';
import {Col, Container, Image, Row, Modal, Button, Form, Alert} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import instance from './axiosInstance';

const TransferTypeList = () => {

  const [card, setCard] = useState();

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

  const [deposit, setDeposit] = useState([]);
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

  const [message, setMessage] = useState("");
  const [sum, setSum] = useState("");
  const [phone, setPhone] = useState("");
  const [card_num, setCardNum] = useState("");
  const [iban, setIban] = useState("")
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
        message: message,
        from_card: true
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

  const handleFormSubmit2 = (e) => {
    e.preventDefault();

    instance
      .post("card_transfer/", {
        sender_card: card.id,
        phone: phone,
        amount: sum,
        message: message,
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

  const handleFormSubmit3 = (e) => {
    e.preventDefault();

    instance
      .post("card_transfer/", {
        sender_card: card.id,
        card_num: card_num,
        amount: sum,
        message: message,
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

    const handleFormSubmit4 = (e) => {
      e.preventDefault();
  
      instance
        .post("card_transfer/", {
          sender_card: card.id,
          iban: iban,
          amount: sum,
          message: message,
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
  

    const [showModalBetweenYourth, setShowModalBetweenYourth] = useState(false);
    const [showModalPhone, setShowModalPhone] = useState(false);
    const [showModalCardNum, setShowModalCardNum] = useState(false);
    const [showModalIBAN, setShowModalIBAN] = useState(false);


    return (
        <Container style={{display: "flex",
            alignItems: "center",
            flexDirection: "column-reverse"}}>
            <Col className="justify-content-center" style={{width: "max-content"}}>
                <h1 className=" text-center">Переводы </h1>
                <Row>
                    <Button className="border border-primary border-0 rounded-5 mt-2 my-3 p-3" variant="primary" style={{background: "#ededed",
                                                     width: "100%",
                                                     color: "black"}} 
                                                     onClick={() => setShowModalBetweenYourth(true)}>
                      <div style={{ display: "flex", alignItems: "center"}}>
                        <Image src="https://img.icons8.com/ios-filled/50/null/data-in-both-directions.png" style={{ display: "block", maxWidth: "40px"}}/>
                        <h5 className="ms-3">Между своими счетами</h5>
                      </div>
                    </Button>
                </Row>
                <Row>
                    <Button className="border border-primary border-0 rounded-5 mt-2 my-3 p-3" variant="primary" style={{background: "#ededed",
                                                     width: "100%",
                                                     color: "black"}} 
                                                     onClick={() => setShowModalPhone(true)}>
                        <div style={{ display: "flex", alignItems: "center"}}>
                            <Image src="https://img.icons8.com/ios/50/null/iphone.png" style={{ display: "block", maxWidth: "40px" }}/>
                            <h5 className="ms-3">по номеру телефона</h5>
                        </div>
                    </Button>
                </Row>
                <Row>
                    <Button className="border border-primary border-0 rounded-5 mt-2 my-3 p-3" variant="primary" style={{background: "#ededed",
                                                     width: "100%",
                                                     color: "black"}} 
                                                     onClick={() => setShowModalCardNum(true)}>
                        <div style={{ display: "flex", alignItems: "center"}}>  
                            <Image src="https://img.icons8.com/ios/50/null/bank-card-back-side--v1.png" style={{ display: "block", maxWidth: "40px" }}/>
                            <h5 className="ms-3">по номеру карты</h5>
                        </div>
                    </Button>
                </Row>
                <Row>
                    <Button className="border border-primary border-0 rounded-5 mt-2 my-3 p-3" variant="primary" style={{background: "#ededed",
                                                     width: "100%",
                                                     color: "black"}} 
                                                     onClick={() => setShowModalIBAN(true)}>
                        <div style={{ display: "flex", alignItems: "center"}}>
                            <Image src="https://img.icons8.com/ios/50/null/numbers-input-form.png" style={{ display: "block", maxWidth: "40px" }}/>
                            <h5 className="ms-3">по IBAN</h5>
                        </div>
                    </Button>
                </Row>
            </Col>
            {showModalBetweenYourth && (
                <Modal show={showModalBetweenYourth} onHide={() => setShowModalBetweenYourth(false)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Между своими счетами</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formFromAccount">
                              <Form.Label>С карты</Form.Label>
                              <Form.Control
                                as="select"
                                required
                              >
                                <option >{card.name} -- {card.sum} тг</option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>На депозит</Form.Label>
                              <Form.Control
                                as="select"
                                required
                              >
                                <option>{deposit.name}  -- {deposit.sum} тг</option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Сумма</Form.Label>
                              <Form.Control
                                type="number"
                                required
                                min={100}
                                max={card.sum}
                                value={sum}
                                onChange={handleSumChange}
                              />
                              {showAlert && (
                                <Alert variant="danger">
                                  Сумма должна быть не меньше 100 и не больше {card.sum}
                                </Alert>
                              )}
                            </Form.Group>
                            <Button className="mt-2" variant="primary" type="submit" onClick={handleFormSubmit1}>
                              Перевод
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>)
            }
            {showModalPhone && (
                <Modal show={showModalPhone} onHide={() => setShowModalPhone(false)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Перевод по номеру</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formFromAccount">
                              <Form.Label>С карты</Form.Label>
                              <Form.Control
                                as="select"
                                required
                              >
                                <option >{card.name} -- {card.sum} тг</option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>по номеру телефона</Form.Label>
                              <Form.Control
                                type="phone"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                              >
                              </Form.Control>
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Сумма</Form.Label>
                              <Form.Control
                                type="number"
                                required
                                min={100}
                                max={card.sum}
                                value={sum}
                                onChange={handleSumChange}
                              />
                              {showAlert && (
                                <Alert variant="danger">
                                  Сумма должна быть не меньше 100 и не больше {card.sum}
                                </Alert>
                              )}
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Сообщение</Form.Label>
                              <Form.Control
                                  type='text'
                                  required
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                              />
                            </Form.Group>
                            <Button className="mt-2" variant="primary" type="submit" onClick={handleFormSubmit2}>
                              Перевод
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>)
            }
            {showModalCardNum && (
                <Modal show={showModalCardNum} onHide={() => setShowModalCardNum(false)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Перевод по номеру карты</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formFromAccount">
                              <Form.Label>С карты</Form.Label>
                              <Form.Control
                                as="select"
                                required
                              >
                                <option >{card.name} -- {card.sum} тг</option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>по номеру карты</Form.Label>
                              <Form.Control
                                type="text"
                                required
                                value={card_num}
                                onChange={(e) => setCardNum(e.target.value)}
                              >
                              </Form.Control>
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Сумма</Form.Label>
                              <Form.Control
                                type="number"
                                required
                                min={100}
                                max={card.sum}
                                value={sum}
                                onChange={handleSumChange}
                              />
                              {showAlert && (
                                <Alert variant="danger">
                                  Сумма должна быть не меньше 100 и не больше {card.sum}
                                </Alert>
                              )}
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Сообщение</Form.Label>
                              <Form.Control
                                  type='text'
                                  required
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                              />
                            </Form.Group>
                            <Button className="mt-2" variant="primary" type="submit" onClick={handleFormSubmit3}>
                              Перевод
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>)
            }
            {showModalIBAN && (
                <Modal show={showModalIBAN} onHide={() => setShowModalIBAN(false)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Перевод по номеру карты</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formFromAccount">
                              <Form.Label>С карты</Form.Label>
                              <Form.Control
                                as="select"
                                required
                              >
                                <option >{card.name} -- {card.sum} тг</option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>по номеру IBAN</Form.Label>
                              <Form.Control
                                type="text"
                                required
                                value={iban}
                                onChange={(e) => setIban(e.target.value)}
                              >
                              </Form.Control>
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Сумма</Form.Label>
                              <Form.Control
                                type="number"
                                required
                                min={100}
                                max={card.sum}
                                value={sum}
                                onChange={handleSumChange}
                              />
                              {showAlert && (
                                <Alert variant="danger">
                                  Сумма должна быть не меньше 100 и не больше {card.sum}
                                </Alert>
                              )}
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Сообщение</Form.Label>
                              <Form.Control
                                  type='text'
                                  required
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                              />
                            </Form.Group>
                            <Button className="mt-2" variant="primary" type="submit" onClick={handleFormSubmit4}>
                              Перевод
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>)
            }
        </Container>
    )
};

export default TransferTypeList;