import {React, useState, useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, ListGroup, Image, Row, Col, Modal, Form, Alert} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import instance from './axiosInstance';

const CreditListDetail = () => {
    const { name } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [credit, setCredit] = useState({});
    const [monthCount, setMonthCount] = useState(3); // начальное значение равно 3
    const [sumVid, setSumVid] = useState();
    const [finalSum, setFinalSum] = useState();
    const [income, setIncome] = useState("");
    const [familyMembers, setFamilyMembers] = useState("");
    const [hasOwnHouse, setHasOwnHouse] = useState(false);
    const MIN_WAGE = 70000; // Минимальная зарплата в Казахстане
    const RENT = 150000; // Аренда жилья


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
        .get(`http://localhost:8000/api/v1/credit_kinds/${name}/`)
        .then((response) => setCredit(response.data))
        .catch((error) => console.log(error));
    }, [name]);
    
    const handleSumVidChange = (e) => {
      setSumVid(e.target.value);
      calculateFinalSum(e.target.value, monthCount);
    };

    const handleMonthCountChange = (e) => {
      setMonthCount(e.target.value);
      calculateFinalSum(sumVid, e.target.value);
    };

    const handleIncomeChange = (event) => {
      setIncome(event.target.value);
    };
  
    const handleFamilyMembersChange = (event) => {
      setFamilyMembers(event.target.value);
    };
  
    const handleHasOwnHouseChange = (event) => {
      setHasOwnHouse(event.target.checked);
    };

    const isEligible = () => {
      const monthlyPayment = finalSum / monthCount;
      const remainingIncome = income - monthlyPayment - (hasOwnHouse ? 0 : RENT);
    
      return remainingIncome >= monthlyPayment * 2 && remainingIncome >= MIN_WAGE - RENT;
    };

    const calculateFinalSum = (sumVid, monthCount) => {
      const percent = credit.percent;
      const finalSum = parseFloat(sumVid) + parseFloat(sumVid) * percent / 100 * monthCount / 12;
      setFinalSum(finalSum);
    };

    function getMonthOptions(maxYears) {
      const options = [3, 6, 12, 24];
      for (let i = 1; i <= maxYears; i++) {
        options.push(i * 12);
      }
      return options;
    }
    
    const handleFormSubmit = (e) => {
      instance.post('create_credit/', {
        sum: finalSum,
        sum_vid: sumVid,
        percent: credit.percent,
        month_count: monthCount,
        kind: credit.id
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
        // вывод сообщения об ошибке
        if (error.response && error.response.data && error.response.data.error) {
          alert(error.response.data.error);
        }
      });
    };


  return (
    <Container>
        <Row className="border border-primary border-0 rounded-5 mt-3 mb-3" style={{background: '#ededed'}}>
            <Col md={6} className="p-5 bg-transparent">
                <h1>Кредит "{credit.name}"</h1>
                <p>{credit.additional_info}</p>
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
                                        <h4>{credit.max_sum} тг</h4>
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
                    {isAuthenticated() && (
                    <div>
                        <Button onClick={() => setShowModal(true)}>Перейти к оформлению</Button>
                    </div>)}
                </div>
            </Col>
            <Col md={6} className="p-5 bg-transparent w-auto mt-auto mb-auto">
                <Image src={`${'http://127.0.0.1:8000'}${credit.pict}`} alt='Card' className="mx-auto align-items-center" style={{ display: "block", maxWidth: "400px" }}/>
            </Col>
        </Row>
        {showModal && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Оформление кредита</Modal.Title>
                </Modal.Header>
                <Form>
                  <Modal.Body>
                    <Form.Group>
                      <Form.Label>Ежемесячный доход</Form.Label>
                      <Form.Control
                        type="number"
                        required
                        value={income}
                        onChange={handleIncomeChange}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Колличество членов семьи</Form.Label>
                      <Form.Control
                        type="number"
                        required
                        value={familyMembers}
                        onChange={handleFamilyMembersChange}
                      />
                    <Form.Group>
                      <Form.Check type="checkbox" checked={hasOwnHouse}
                      onChange={handleHasOwnHouseChange} label="Свое жилье" />
                    </Form.Group>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Срок кредитования (месяцы)</Form.Label>
                      <Form.Control
                        as="select"
                        required
                        value={monthCount}
                        onChange={handleMonthCountChange}
                      >
                        {getMonthOptions(credit.max_year).map((month) => (
                          <option key={month}>{month}</option>
                        ))}
                      </Form.Control>  
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Сумма</Form.Label>
                      <Form.Control
                        type="number"
                        rrequired
                        value={sumVid}
                        onChange={handleSumVidChange}
                      />
                    </Form.Group>
                    {finalSum && (
                      <div>
                        <p>
                          Сумма с процентами: {(finalSum).toLocaleString('ru-RU')} тг
                        </p>
                        <p>
                          Переплата: {(finalSum.toFixed(2) - sumVid).toLocaleString('ru-RU')} тг
                        </p>
                        <p>
                          Ежемесячный платеж: {(finalSum/monthCount).toLocaleString('ru-RU')} тг
                        </p>
                      </div>
                    )}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                      Закрыть
                    </Button>
                    {isEligible() ? (
                      <Button variant="primary" type="submit" onClick={handleFormSubmit}>
                        Отправить
                      </Button>
                    ) : (
                      <Alert>Недостаточно дохода для доверительного платежа</Alert>
                    )}
                  </Modal.Footer>
                </Form>
                </Modal>
            )}  
    </Container>    
  );
};

export default CreditListDetail;
