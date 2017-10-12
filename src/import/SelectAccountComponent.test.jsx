import React from 'react';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import { FormControl } from 'react-bootstrap';
import uuid from 'uuid/v4';
import sinon from 'sinon';
import SelectAccount from './SelectAccountComponent';

should();

describe('select account component', () => {
  it('shows drop down with list of accounts', () => {
    const accounts = [
      {
        id: uuid(),
        name: 'account one',
      },
      {
        id: uuid(),
        name: 'account two',
      },
    ];
    const component = shallow(
      <SelectAccount
        accounts={accounts}
        onAccountSelected={sinon.stub()}
      />);

    const dropDown = component.find(FormControl);
    assert(dropDown.exists().should.equal(true));

    const options = dropDown.find('option');
    assert(options.length.should.equal(3));
    assert(options.get(0).props.value.should.equal(''));
    assert(options.get(0).props.children.should.equal('Choose account to import into'));
    assert(options.get(1).props.value.should.equal(accounts[0].id));
    assert(options.get(1).props.children.should.equal('account one'));
    assert(options.get(2).props.value.should.equal(accounts[1].id));
    assert(options.get(2).props.children.should.equal('account two'));
  });

  it('triggers onAccountSelected when selection changes', () => {
    const accounts = [
      {
        name: 'account one',
      },
      {
        name: 'account two',
      },
    ];
    const onAccountSelected = sinon.stub();
    const component = shallow(
      <SelectAccount
        accounts={accounts}
        onAccountSelected={onAccountSelected}
      />);

    const e = {
      target: {
        value: uuid(),
      },
    };

    component.find(FormControl).prop('onChange')(e);

    assert(onAccountSelected.calledWith(e.target.value));
  });
});
