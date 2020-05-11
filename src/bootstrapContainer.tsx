import React, { ComponentType } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

const bootstrapContainer = (App: ComponentType, rootId = 'root') => {
  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById(rootId),
  );
};

export default bootstrapContainer;
