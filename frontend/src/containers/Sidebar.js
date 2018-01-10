import React, {Component} from 'react';
import {Transition} from 'react-transition-group';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import DonationForm from '../components/DonationForm';
import {selectItem} from '../actions'

import '../style/Sidebar.css';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.closeOverlay = this.closeOverlay.bind(this);
  }

  closeOverlay() {
    // Deselect item.
    this.props.onSelectItem(null);
  }

  render() {
    const duration = 300;

    const overlayTransitionStyles = {
      entering:  { display: 'block' },
      entered:  { display: 'block', opacity: 0.8 },
      exiting: { display: 'block', },
    };

    const transitionStyles = {
      entered:  { height: 'auto', opacity: 1, transform: 'translateX(0)' },
      exiting: { height: 'auto', transform: 'translateX(100%)' },
    };

    const focus = !!this.props.item;

    return (
      <Transition in={focus} timeout={duration}>
        {(state) => (
          <div>
            <div className="overlay" onClick={this.closeOverlay} style={{
              ...overlayTransitionStyles[state]
            }}>
            </div>
            <div className="sidebar" style={{
              ...transitionStyles[state]
            }}>
              <div className="content px-3 text-black">
                <h3>Anna joululahja eläimille</h3>
                <div className="donation-info">
                  
                  <p>
                    Täytä lomakkeeseen <strong>omat tietosi</strong>. 
                  </p>
                </div>
                <DonationForm item={this.props.item} />
                <div className="permit mt-3">
                  <em className="text-muted">
                    Rahankeräyslupa: Oikeutta Eläimille -tukiyhdistys ry
                    Voimassa 1.1.2016 - 31.12.2017 koko Suomen alueella Ahvenanmaata lukuun ottamatta.
                    Luvan numero on POL-2015-8291
                  </em>
                </div>
              </div>
            </div>
          </div>
        )}
      </Transition>
    );
  }
}

function mapStateToProps(state) {
  return {
    item: state.selectedItem
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    onSelectItem: selectItem
  }, dispatch);
}


export default connect(mapStateToProps, matchDispatchToProps)(Sidebar);
