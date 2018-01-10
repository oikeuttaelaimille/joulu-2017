import {combineReducers} from 'redux';

import ItemReducer from './reducer-items';
import SelectedItem from './reducer-selected-item';
import StatisticsReducer from './reducer-statistics';

const allReducers = combineReducers({
  statistics: StatisticsReducer,
  selectedItem: SelectedItem,
  items: ItemReducer,
})

export default allReducers;
