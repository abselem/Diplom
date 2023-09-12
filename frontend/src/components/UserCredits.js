import {React, useState, useEffect} from "react";
import {Col, Container, Image, Row, Button, Modal, Table, Form} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import instance from './axiosInstance';


const UserCredits = () => {
    
    const [credit, setCredit] = useState([]);
    const [showModalCreditPay, setShowModalCreditPay] = useState(false);
    const [showModalHistory, setShowModalHistory] = useState(false);
    const [credit_history, setCreditHistory] = useState();

    useEffect(() => {
        instance
          .get('user_credit_info/')
          .then((response) => {
            setCredit(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);

    useEffect(() => {
        instance
          .get('credit_transfer_history/')
          .then((response) => {
            setCreditHistory(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);

    const handleFormSubmit1 = (e) => {
        e.preventDefault();
    
        instance
          .post("credit_transfer/", {
            credit: credit.id,
            amount: (credit.sum_vid / credit.month_count),
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
        <>
        {credit.percent && (
        <Container>
            <h1>Кредиты: </h1>
            <Row className="border border-primary border-0 rounded-5 my-3 p-3" style={{background: '#ededed'}}>
                <div className="bg-transparent w-auto mt-auto mb-auto">
                    <Image src={`${'http://127.0.0.1:8000'}${credit.credit_kind.pict}`} style={{ display: "block", maxWidth: "120px" }}/>
                </div>
                <div className="bg-transparent w-max ms-auto me-auto" style={{width: "max-content", height: "auto"}}>
                    <Row>
                        <h3 style={{textAlign: 'center'}}>Кредит</h3>
                    </Row>
                    <Row>
                        <Col>
                            <div style={{width:"max-content"}}>
                                <p className="m-0">Ставка  </p>
                                <h5 className="m-0"> {credit.percent} %</h5>
                            </div>
                        </Col>
                        <Col>
                            <div style={{width:"max-content"}}>
                                <p className="m-0">Погашено </p>
                                <h5 className="m-0">{credit.sum_pog} тг</h5>
                            </div>
                        </Col>
                        <Col>
                            <div style={{width:"max-content"}}>
                                <p className="m-0">Осталось </p>
                                <h5 className="m-0">{credit.sum - credit.sum_pog } тг</h5>
                            </div>
                        </Col>  
                        <Col>
                            <div style={{width:"max-content"}}>
                                <p className="m-0">Переплата </p>
                                <h5 className="m-0">{credit.sum - credit.sum_vid } тг</h5>
                            </div>
                        </Col>
                        <Col>
                            <div style={{width:"max-content"}}>
                                <p className="m-0"> Этот месяц </p>
                                {credit.sum_pog/(credit.sum_vid/credit.month_count) >= credit.current_month ? (
                                    <Image src='./done.png' className="ms-auto me-auto" style={{ display: "block", maxWidth: "30px" }}/>
                                ) : (
                                    <Image src='./no.png' className="ms-auto me-auto" style={{ display: "block", maxWidth: "30px" }}/>
                                )}
                                
                            </div>
                        </Col>
                        <Col>
                            <div style={{width:"max-content"}}>
                                <p className="m-0">Pay </p>
                                <h5 className="m-0">{Math.floor(credit.sum_pog/(credit.sum_vid/credit.month_count))}/{credit.month_count}</h5>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div>
                            </div>
                        </Col>
                        <Col>
                            <div>
                            {credit.sum - credit.sum_pog >= 1 && (
                            <Button className="border border-3 rounded-5 mt-2 my-3 p-3" variant="primary" style={{
                                                             width: 'max-content',
                                                             color: "black",
                                                             background: "white",
                                                             border: "2px solid black",
                                                             transition: "all 0.3s ease-in-out"}} 
                                                             onClick={() => setShowModalCreditPay(true)}>
                              <div style={{ display: "flex", alignItems: "center"}}>
                                <p className="ms-3" style={{display: 'contents'}}>Оплата</p>
                              </div>
                            </Button>
                            )}
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
                        <Col>
                            <div>
                            <Button className="border border-3 rounded-5 mt-2 my-3 p-3" variant="primary" style={{
                                                             width: 'max-content',
                                                             color: "black",
                                                             background: "white",
                                                             border: "2px solid black",
                                                             transition: "all 0.3s ease-in-out"}} 
                                                             onClick={() => window.location.href=`/credittypes/${credit.credit_kind.name}`}>
                              <div style={{ display: "flex", alignItems: "center"}}>
                                <p className="ms-3" style={{display: 'contents'}}>О вашем кредите</p>
                              </div>
                            </Button>
                            </div>
                        </Col>
                        <Col>
                            <div>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="bg-transparent w-auto mt-auto mb-auto">
                    <Row>
                        <div>
                            <p className="m-0">
                                <h5>Общая сумма:</h5> 
                            </p >
                            <p className="m-0">
                                {credit.sum}
                            </p>
                        </div>
                    </Row>
                </div>
            </Row>
            {showModalCreditPay && (
                <Modal show={showModalCreditPay} onHide={() => showModalCreditPay(false)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Ежемесячная оплата</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formFromAccount">
                              <Form.Label>На кредит</Form.Label>
                              <Form.Control
                                as="select"
                                required
                              >
                                <option >Погашено -- {credit.sum_pog} тг</option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Сумма</Form.Label>
                              <Form.Control
                                type="number"
                                required
                                value={Math.ceil(credit.sum_vid / credit.month_count)}
                                readOnly
                              />
                            </Form.Group>
                            <Button className="mt-2" variant="primary" type="submit" onClick={handleFormSubmit1}>
                              Оплата
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
                        <Table>
                            <thead>
                              <tr>
                                <th>Дата</th>
                                <th>Сумма</th>
                              </tr>
                            </thead>
                            <tbody>
                              {credit_history.map((item, index) => (
                                <tr key={index}>
                                    <td>{formatDate(item.created_at)}</td>
                                    <td>{item.sum}</td>
                                </tr>
                              ))}
                            </tbody>
                        </Table>
                    </Modal.Body>
                </Modal>
            )}
        </Container>
        )}
        </>
    )
};

export default UserCredits;