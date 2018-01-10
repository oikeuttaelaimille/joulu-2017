import {Actions} from '../actions'

export default function(state=null, action) {
  switch (action.type) {
    case Actions.SELECT_ITEM:
      return action.payload;
    default:
      return state;
  }
}
