import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import Item from '../components/Item'
import {selectItem} from '../actions'

class ItemList extends Component {
  render() {
    return (
      <div className="row">
        {this.props.items.map((obj, i) => {
          return <Item onSelect={() => this.props.onSelectItem(obj)} key={i} item={obj} />
        })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    items: state.items
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    onSelectItem: selectItem
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ItemList);
