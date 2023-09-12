import {React, useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import {Col, Container, Row, Modal, Button, Form, Image} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import instance from './axiosInstance';


const PayListDetail = () => {
    const { name } = useParams();
  const [companies, setCompanies] = useState([]);
  const [company1, setСompany1] = useState();
  const [showModal, setShowModal] = useState(false);
  const [sum, setSum] = useState();
  const [bill, setBill] = useState();

    useEffect(() => {
      instance
        .get(`payment_company_categories/${name}/`)
        .then((response) => {
          setCompanies(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }, [name]);

    const handleCompanySelect = (company) => {
        setСompany1(company);
      };

    const handleFormSubmit = (e) => {
        e.preventDefault();
    
        instance
          .post("pay/", {
            company: company1.id,
            amount: sum,
            bill_count_number: bill
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

    return (
        <Container style={{display: "flex",
            alignItems: "center",
            flexDirection: "column-reverse"}}>
            <Col className="justify-content-center" style={{width: "max-content"}}>
                <h1 className=" text-center">Платежи "{name}"</h1>
                {companies.map((company) => (
                <Row>
                    <Button key={company.id} className="border border-primary border-0 rounded-5 mt-2 my-3 p-3" variant="primary" style={{background: "#ededed",
                                                     width: "100%",
                                                     color: "black"}} 
                                                     onClick={() => {
                                                        handleCompanySelect(company);
                                                        setShowModal(true);
                                                      }}>
                      <div style={{ display: "flex", alignItems: "center"}}>
                        <Image src={`${company.logo}`} style={{ display: "block", maxWidth: "40px"}}/>
                        <h5 className="ms-3">{company.name}</h5>
                      </div>
                    </Button>
                </Row>
                ))}
            </Col>
            {showModal && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Платеж {company1.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="d-flex align-items-center justify-content-center">
                                <Image src={`${company1.logo}`} style={{ display: "block", maxWidth: "100px"}}/>
                                <h5 className="ms-4">{company1.name}</h5>
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Лицевой счет ({company1.bill_count_number} символов)</Form.Label>
                              <Form.Control
                                type="number"
                                required
                                value={bill}
                                maxLength={company1.bill_count_number}
                                minLength={company1.bill_count_number}
                                onChange={(event) => setBill(event.target.value)}
                              >
                            </Form.Control>
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Сумма</Form.Label>
                              <Form.Control
                                type="number"
                                required
                                value={sum}
                                min={100}
                                onChange={(event) => setSum(event.target.value)}
                              />
                            </Form.Group>
                            <Button className="mt-2" variant="primary" type="submit" onClick={handleFormSubmit}>
                              Оплата
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>)
            }
        </Container>
    )
};

export default PayListDetail;