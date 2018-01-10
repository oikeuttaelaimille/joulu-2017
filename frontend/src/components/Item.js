import React from 'react';

import Utils from '../Utils'

const Item = ({ item, onSelect }) => {
  const callback = () => {
    Utils.scrollTo(document.documentElement, 0, 300);
    onSelect(item);
  }

  return (
    <div className="item col-12 col-md-5 col-xl-5 mb-4 mx-auto">
      <div className="card item">
        <img className="card-img-top" src={item.img} alt="Card cap" />
        <div className="card-body d-flex flex-column">
          <h4 className="card-title">{item.title}</h4>
          <p className="card-text mb-auto">{item.body}</p>
          <div>
            <button className="btn btn-primary" onClick={callback}>{item.button || 'Osta'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Item;
