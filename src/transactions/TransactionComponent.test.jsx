import React from 'react';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import Transaction from './TransactionComponent';

should();

describe('transaction component', () => {
  it('renders date', () => {
    const transaction = {
      name: 'the transaction',
      amount: 12.34,
      date: new Date(2017, 7, 1),
    };
    const component = shallow(<Transaction transaction={transaction} />);

    assert(component.find('.date').text().should.equal('01/08/2017'));
  });
});
