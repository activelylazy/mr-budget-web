import React from 'react';
import { should } from 'chai';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import ReactTestUtils from 'react-dom/test-utils';
import Import from './ImportContainer';

const store = configureMockStore()({
  statementImport: {
    importInProgress: false,
  },
  userData: {
    accounts: [],
  },
});

should();

describe('import container', () => {
  it('renders without crashing', () => {
    ReactTestUtils.renderIntoDocument(
      <Provider store={store}>
        <Import />
      </Provider>);
  });
});
