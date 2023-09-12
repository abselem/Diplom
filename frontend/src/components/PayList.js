import {React, useState, useEffect} from "react";
import {Col, Container, Row, Button, Image, Modal, Table} from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import instance from './axiosInstance';


const PayList = () => {
  const [categories, setCategories] = useState([]);
  const [pay_history, setPayHistory] = useState([]);
  const [showModalHistory, setShowModalHistory] = useState(false);

    useEffect(() => {
      instance
        .get('payment_company_categories/')
        .then((response) => {
          setCategories(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }, []);

    useEffect(() => {
      instance
        .get('pay_transfer_history/')
        .then((response) => {
          setPayHistory(response.data);
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
        <Container style={{display: "flex",
            alignItems: "center",
            flexDirection: "column-reverse"}}>
            <Col className="justify-content-center" style={{width: "max-content"}}>
                <h1 className=" text-center">Платежи </h1>
                {categories.map((category) => (
                <Row>
                    <Link to={`/PayList/${category.name}`}>
                    <Button key={category.name} className="border border-primary border-0 rounded-5 mt-2 my-3 p-3" variant="primary" style={{background: "#ededed",
                                                     width: "100%",
                                                     color: "black"}} 
                                                     on>
                      <div style={{ display: "flex", alignItems: "center"}}>
                        <Image src={`${category.logo}`} style={{ display: "block", maxWidth: "40px"}}/>
                        <h5 className="ms-3">{category.name}</h5>
                      </div>
                    </Button>
                    </Link>
                </Row>
                ))}
                <Row>
                  <div className="d-flex align-items-center justify-content-center">
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
                </Row>
            </Col>
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
                                <th>Компния</th>
                                <th>Лиц.счет</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pay_history.map((item, index) => (
                                <tr key={index}>
                                    <td>{formatDate(item.created_at)}</td>
                                    <td>{item.sum} тг</td>
                                    <td>{item.company.name}</td>
                                    <td>{item.bill_pay_num}</td>
                                </tr>
                              ))}
                            </tbody>
                        </Table>
                    </Modal.Body>
                </Modal>
            )}
        </Container>
    )
};

export default PayList;