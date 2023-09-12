import {React, useState, useEffect} from "react";
import {Col, Container, Image, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import instance from './axiosInstance';



const UserInfo = () => {
    const [User, setUser] = useState([]);

    useEffect(() => {
        instance
          .get('user_info/')
          .then((response) => {
            setUser(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);
    


    return (
        <Container>
            <Row className="border border-primary border-0 rounded-5 my-3 p-3" style={{background: '#ededed'}}>
                <div className="bg-transparent w-auto h-auto">
                    <Image src={`${'http://127.0.0.1:8000'}${User.person_picture}`} className="rounded-circle" style={{ display: "block", maxWidth: "250px", maxHeight: "250px" }}/>
                </div>
                <div className="bg-transparent w-max" style={{width: "max-content", height: "auto"}}>
                    <Row>
                        <Col>
                            <div>
                                <p className="m-0">Фамилия</p>
                                <h5>{User.last_name}</h5>
                            </div>
                        </Col>
                        <Col>
                            <div>
                                <p className="m-0">Имя</p>
                                <h5>{User.first_name}</h5>
                            </div>
                        </Col>
                        <Col>
                            <div>
                                <p className="m-0">Отчество</p>
                                <h5>{User.middle_name}</h5>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div style={{width:"max-content", display:"flex"}}>
                                <p>Дата рождения:  </p>
                                <h5 className="ms-1"> {User.date_of_birth}</h5>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div style={{width:"max-content", display:"flex"}}>
                                <p>ИИН:</p>
                                <h5>{User.iin}</h5>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Row>
        </Container>
    )
};

export default UserInfo;