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

  it('renders missing date', () => {
    const transaction = {
      name: 'the transaction',
      amount: 12.34,
    };
    const component = shallow(<Transaction transaction={transaction} />);

    assert(component.find('.date').text().should.equal(''));
  });

  it('renders name', () => {
    const transaction = {
      name: 'the transaction',
      amount: 12.34,
      date: new Date(2017, 7, 1),
    };
    const component = shallow(<Transaction transaction={transaction} />);

    assert(component.find('.name').text().should.equal('the transaction'));
  });

  it('renders amount', () => {
    const transaction = {
      name: 'the transaction',
      amount: 12.34,
      date: new Date(2017, 7, 1),
    };
    const component = shallow(<Transaction transaction={transaction} />);

    assert(component.find('.amount').text().should.equal('£ 12.34'));
  });

  it('renders missing amount', () => {
    const transaction = {
      name: 'the transaction',
      date: new Date(2017, 7, 1),
    };
    const component = shallow(<Transaction transaction={transaction} />);

    assert(component.find('.amount').text().should.equal(''));
  });

  it('does not render balance if none present', () => {
    const transaction = {
      name: 'the transaction',
      amount: 12.34,
      date: new Date(2017, 7, 1),
    };
    const component = shallow(<Transaction transaction={transaction} />);

    assert(component.find('.balance').exists().should.equal(false));
  });

  it('renders balance if present', () => {
    const transaction = {
      name: 'the transaction',
      amount: 12.34,
      date: new Date(2017, 7, 1),
    };
    const component = shallow(<Transaction transaction={transaction} balance={22.33} />);

    assert(component.find('.balance').text().should.equal('£ 22.33'));
  });
});
