import React, { Component } from 'react';
import Statistics from '../containers/Statistics';
import ItemList from '../containers/ItemList';
import Sidebar from '../containers/Sidebar'

import '../style/App.css';

const logo = require('../images/logo.svg');

class App extends Component {
  render() {
    const headingText = "Anna tänä jouluna aineeton lahja ystävällesi – tee hänen nimissään lahjoitus eläinten hyväksi. Tule mukaan joulukeräykseemme!";
    return (
      <div className="main-content">
        <div className="container">

          <div className="header text-white d-flex flex-row align-items-center">
            <img className="logo mr-auto" src={logo} alt="Oikeutta eläimille -yhdistyksen logo"/>
            <h2>Anna joululahja eläimille</h2>
          </div>

          <div className="embed-responsive embed-responsive-16by9 mb-4">
            <iframe src="https://player.vimeo.com/video/244448088" width="640" height="360" frameBorder="0" allowFullScreen title="Jouluvideo"></iframe>
          </div>

          <div className="hero-text text-center text-white mb-3">
            <h1 className="heading">Myötätunto on kallisarvoisin lahja</h1>
            <p className="lead">Muista tänä jouluna eläimiä ystäväsi nimissä.</p>
            <div className="heading-text mx-auto">
              <p>{headingText}</p>
            </div>
          </div>

          <ItemList />

          <Statistics />

        </div>
        <Sidebar />
      </div>
    );
  }
}

export default App;
