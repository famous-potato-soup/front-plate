import React from 'react';
import './App.css';

import FacebookLogin from './OAuthLogin';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <FacebookLogin />
      </header>
    </div>
  );
};

export default App;
