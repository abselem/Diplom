import React from "react";
import Header from './components/Header';
import Footer from "./components/Footer/Footer";
import {
    BrowserRouter as Router,
    Route,
    Routes
  } from "react-router-dom";

import { Home } from "./Home";
import Login from "./components/Login";
import Register from "./components/Register";
import CardList from "./components/CardList";
import DepositList from "./components/DepositList";
import CreditList from "./components/CreditList";
import TransferTypesList from "./components/TransferTypesList";
import CurrencyWidget from "./components/CurrencyWidget";
import MyBank from "./MyBank";
import CardListDetail from "./components/CardListDetail";
import DepositListDetail from "./components/DepositListDetail";
import CreditListDetail from "./components/CreditListDetail";
import About from "./components/About";
import PayList from "./components/PayList";
import PayListDetail from "./components/PayListDetail";
import { Helmet } from 'react-helmet';


function App() {
    return (
        <>
        <Helmet>
            <title>Abselemov bank</title>
            <link rel="icon" type="image/png" href="./favicon.png" />
        </Helmet>
        <Router>
        <Header />
        <Routes>
            <Route path="/" Component={Home} />
            <Route path="/about" Component={About} />
            <Route path="/cardtypes" Component={CardList} />
            <Route path="/cardtypes/:name" Component={CardListDetail} />
            <Route path="/deposittypes" Component={DepositList} />
            <Route path="/deposittypes/:name" Component={DepositListDetail} />
            <Route path="/credittypes" Component={CreditList} />
            <Route path="/credittypes/:name" Component={CreditListDetail} />
            <Route path="/login" Component={Login} />
            <Route path="/register" Component={Register} />
            <Route path="/mybank" Component={MyBank} />
            <Route path="/transfertypes" Component={TransferTypesList} />
            <Route path="/Currency" Component={CurrencyWidget} />
            <Route path="/About" Component={About} />
            <Route path="/PayList" Component={PayList} />
            <Route path="/PayList/:name" Component={PayListDetail} />
        </Routes>
        </Router>
        <Footer />
        </>
    )
}

export default App;
