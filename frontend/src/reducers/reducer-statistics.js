import {Actions} from '../actions'

export default function(state=null, action) {
  switch (action.type) {
    case Actions.LOAD_STATISTICS:
      return action.payload;
    default:
      return state;
  }
}
