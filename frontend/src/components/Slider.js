import React from "react";
import { Carousel } from "react-bootstrap";


export default function Slider() {
    return(
        <Carousel style={{'text-color': 'black'}}>
            <Carousel.Item style={{'height': '600px', "background-color": "black"}}>
                <img className="d-block w-100" src="./slider1.jpg" alt='error'/>
                <Carousel.Caption style={{'color': 'black'}}>
                    <h6>Abselemov Bank</h6>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item style={{'height': '600px', "background-color": "black"}}>
                <img className="d-block w-100" src="./ocean.jpg" alt='error'/>
                <Carousel.Caption style={{'color': 'black'}}>
                    <h6>Abselemov Bank</h6>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item style={{'height': '600px', "background-color": "black"}}>
                <img className="d-block w-100" src="./slider2.jpg" alt='error'/>
                <Carousel.Caption style={{'color': 'black'}}>
                    <h3>
                        Перейдите в раздел карты
                    </h3>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    )
}
