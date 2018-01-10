import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Environment from '../Environment';
import Utils from '../Utils';

import '../style/Confirm.css';

const cardImage = require('../images/konsti-1.jpg');
const logo = require('../images/logo.svg');

class Confirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmed: false,
      error: false
    }
  }


  componentDidMount() {
    var data = {};
    if (window.location.href.indexOf('?') >= 0) {
      var params = window.location.href.split('?')[1].split('&');
      for(var i = 0; i < params.length; i++) {
        var temp = params[i].split('=');
        data[temp[0]] = temp[1];
      }

      console.log(data);

      axios.post(Environment.endpoint + '/payment/confirm', {
        confirm: data
      }).then(res => {
        console.log("HMAC verified");

        window.history.replaceState(null, "", window.location.href.split("?")[0]);
        Utils.analytics.completePurchase(res.data.amount || 0);
      }).catch(err => {
        this.setState({
          error: true
        });

        console.log(err);
      });
    }
  }

  render() {
    return (
      <div className="confirm main-content">
        <div className="container">
          <div className="header text-white d-flex flex-row align-items-center">
            <Link to="/">
              <img className="logo mr-auto" src={logo} alt="Oikeutta eläimille -yhdistyksen logo"/>
            </Link>
            <h2 className={this.state.confirmed ? '' : 'd-none'}>lahjoituksesi tuli perille</h2>
          </div>
          <div className="card">
            <img className="card-img-top" src={cardImage} alt="Kiitoskuva"/>
            <div className="card-body text-white">
              {this.state.error ? (
                <div>
                  <h2 className="card-title">O-ou! Maksun rekisteröinti epäonnistui.</h2>
                </div>
              ) : (
                <div>
                  <h1 className="card-title">Lämmin kiitos tuestasi!</h1>
                  <p className="card-text">Kiitos, että olet mukana tekemässä parempaa maailmaa eläimille.</p>
                  <p className="card-text">Hyvää joulun odotusta,<br />Oikeutta eläimille -yhdistyksen väki.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Confirm;
