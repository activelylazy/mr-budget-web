import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './AppContainer';
import configureStore from './configureStore';

it('renders without crashing', () => {
  const store = configureStore();
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}>
    <App />
  </Provider>, div);
});
