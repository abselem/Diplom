import {React} from 'react';
// import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserInfo from './components/UserInfo';
import UserCards from './components/UserCards';
import UserDeposits from './components/UserDeposits';
import UserCredits from './components/UserCredits';

const DepositList = () => {

  return (
    <>
      <UserInfo />
      <UserCards />
      <UserDeposits />
      <UserCredits />
    </>
  )
};

export default DepositList;