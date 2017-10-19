import React from 'react';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import sinon from 'sinon';
import uuid from 'uuid';
import Import from './ImportComponent';
import SelectFile from './SelectFileComponent';
import SelectAccount from './SelectAccountComponent';

should();

describe('import component', () => {
  it('allows selection of file initially', () => {
    const component = shallow(
      <Import
        onUpload={sinon.stub()}
        accounts={[]}
        statement={null}
        onAccountSelected={sinon.stub()}
        onImport={sinon.stub()}
        showSuccess={sinon.stub()}
      />);

    assert(component.find(SelectFile).exists().should.equal(true));
  });

  it('does not show upload button initially', () => {
    const component = shallow(
      <Import
        onUpload={sinon.stub()}
        accounts={[]}
        statement={null}
        onAccountSelected={sinon.stub()}
        onImport={sinon.stub()}
        showSuccess={sinon.stub()}
      />);

    assert(component.find('.import-button').exists().should.equal(false));
  });

  it('shows account selection after statement imported', () => {
    const statement = {
      transactions: [],
    };
    const component = shallow(
      <Import
        onUpload={sinon.stub()}
        accounts={[]}
        statement={statement}
        onAccountSelected={sinon.stub()}
        onImport={sinon.stub()}
        showSuccess={sinon.stub()}
      />,
    );

    assert(component.find(SelectAccount).exists().should.equal(true));
  });

  it('does not show upload button after import with no account selected', () => {
    const statement = {
      transactions: [],
    };
    const component = shallow(
      <Import
        onUpload={sinon.stub()}
        accounts={[]}
        statement={statement}
        onAccountSelected={sinon.stub()}
        onImport={sinon.stub()}
        showSuccess={sinon.stub()}
      />,
    );

    assert(component.find('.import-button').exists().should.equal(false));
  });

  it('shows upload button after import with no account selected', () => {
    const statement = {
      transactions: [],
    };
    const component = shallow(
      <Import
        onUpload={sinon.stub()}
        accounts={[]}
        statement={statement}
        selectedAccountId={uuid()}
        onAccountSelected={sinon.stub()}
        onImport={sinon.stub()}
        showSuccess={sinon.stub()}
      />,
    );

    assert(component.find('.import-button').exists().should.equal(true));
  });

  it('fires onAccountSelected when an account is selected', () => {
    const statement = {
      transactions: [],
    };
    const onAccountSelected = sinon.stub();
    const component = shallow(
      <Import
        onUpload={sinon.stub()}
        accounts={[]}
        statement={statement}
        onAccountSelected={onAccountSelected}
        onImport={sinon.stub()}
        showSuccess={sinon.stub()}
      />,
    );

    component.find(SelectAccount).prop('onAccountSelected')('my account');

    assert(onAccountSelected.calledWith('my account'));
  });
});
