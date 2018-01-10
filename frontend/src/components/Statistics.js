import React from 'react';

const foxImage = require('../images/fox.svg');

export const ProgressBar = ({total, goal}) => {
  const progress = (Math.min(total, goal) / parseFloat(goal)) * 100;
  const style = {
    width: `${progress}%`
  };

  return (
    <div className="col-12 col-md-6 col-xl-8 mb-4">
      <div className="progress-section">
        <div className="d-flex align-items-end">
          <div className="mr-auto">
            <span className="ml-1"><strong>{total} €</strong> kerätty</span>
          </div>
          <div>
            <img className="progress-decoration" src={foxImage} aria-hidden="true" alt="Decoration" />
          </div>
        </div>
        <div className="progress mb-2" style={{ height: '30px' }}>
          <div className="progress-bar bg-success" role="progressbar" style={style} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <span>Auta meitä keräämään {goal.toLocaleString('fi-FI')} € eläinten hyväksi</span>
      </div>
    </div>
  );
};

export const Top = ({ top_donations }) => {
  return (
    <div className="col-12 col-md-6 col-xl-4 mb-4">
      <div className="hall-of-fame">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th colSpan="2">Suurimmat lahjoitukset</th>
            </tr>
          </thead>
          <tbody>
            {top_donations && top_donations.map((donation, i) => {
              return (
                <tr key={i}>
                  <th scope="row">{i + 1}</th>
                  <td>{donation.name}</td>
                  <td>{donation.amount} €</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
