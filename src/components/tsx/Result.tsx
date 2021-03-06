import React from 'react';
import styled from 'styled-components';

import thumb from '../../assets/img-win.png';
import loseImg from '../../assets/loseImg.png';

const Result_wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-item: center;
  height: 100%;
`;

const WinComponent: React.FC = () => {
  return (
    <Result_wrap>
      <h1>Winner</h1>
      <h2>Name</h2>
      <div className="img_wrap">
        <img src={thumb} alt="thumb" />
      </div>
    </Result_wrap>
  );
};

const LoseComponent: React.FC = () => {
  return (
    <Result_wrap>
      <h1>Lose</h1>
      <h2>Name</h2>
      <div className="img_wrap">
        <img src={loseImg} alt="thumb" />
      </div>
    </Result_wrap>
  );
};

export { WinComponent, LoseComponent };
