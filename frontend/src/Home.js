import React from "react";
import Slider from "./components/Slider";
import CardList from "./components/CardList";
import DepositList from "./components/DepositList";
import CreditList from "./components/CreditList";
import { Container } from "react-bootstrap";
import CurrencyWidget from "./components/CurrencyWidget";


export const Home = () => (
    <>
        <Slider />
        <Container className="mt-3">
            <h2>Виды карт</h2>
            <CardList />
            <h2>Виды депозитов</h2>
            <DepositList />
            <h2>Виды кредитов</h2>
            <CreditList />
            <div className="d-flex justify-content-center align-items-center">
                <h2>Курс валют</h2>
            </div>
            <CurrencyWidget />
        </Container>
    </>
)