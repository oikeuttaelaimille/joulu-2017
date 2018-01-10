import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import axios from 'axios';

import Environment from '../Environment';
import {ProgressBar, Top} from '../components/Statistics'
import {loadStatistics} from '../actions'

import 'spinkit/css/spinners/5-pulse.css';

class Statistics extends Component {
  componentDidMount() {
    axios.get(Environment.endpoint + '/')
    .then(res => {
      this.props.onLoadStatistics(res.data);
    })
    .catch(err => {
      console.log('error');
    });
  }

  render() {
    if (!this.props.statistics) {
      return <div className="sk-spinner-pulse"></div>
    }

    return (
      <div className="statistics row">
        <ProgressBar {...this.props.statistics} />
        <Top {...this.props.statistics} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    statistics: state.statistics
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    onLoadStatistics: loadStatistics
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Statistics);
