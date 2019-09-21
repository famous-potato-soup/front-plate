import React from 'react';
import styled from 'styled-components';

import thumb from '../../assets/img-win.png';
import loseImg from '../../assets/loseImg.png';

const ResultWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-item: center;
  height: 100%;
`;

class WinComponent extends React.Component {
  render() {
    return (
      <ResultWrap>
        <h1>Winner</h1>
        <h2>emygmbnkcp_1568904093@tfbnw.net</h2>
        <div className="img_wrap">
          <img src={thumb} alt="thumb" />
        </div>
      </ResultWrap>
    );
  }
}

const LoseComponent: React.FC = props => {
  return (
    <ResultWrap>
      <h1>Lose</h1>
      <h2>ddkcnufhpj_1568913423@tfbnw.net</h2>
      <div className="img_wrap">
        <img src={loseImg} alt="thumb" />
      </div>
    </ResultWrap>
  );
};

export { WinComponent, LoseComponent };
