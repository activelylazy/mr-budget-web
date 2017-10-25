import React from 'react';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import sinon from 'sinon';
import uuid from 'uuid';
import { Button } from 'react-bootstrap';
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
        infoAlert={sinon.stub()}
        errorAlert={sinon.stub()}
        importInProgress={false}
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
        infoAlert={sinon.stub()}
        errorAlert={sinon.stub()}
        importInProgress={false}
      />);

    assert(component.find('.import-button').exists().should.equal(false));
  });

  it('calls onUpload when file is selected', (done) => {
    const onUpload = () => new Promise((resolve) => {
      done();
      resolve();
    });
    const component = shallow(
      <Import
        onUpload={onUpload}
        accounts={[]}
        statement={null}
        onAccountSelected={sinon.stub()}
        onImport={sinon.stub()}
        infoAlert={sinon.stub()}
        errorAlert={sinon.stub()}
        importInProgress={false}
      />);

    component.find(SelectFile).prop('onUpload')();
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
        infoAlert={sinon.stub()}
        errorAlert={sinon.stub()}
        importInProgress={false}
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
        infoAlert={sinon.stub()}
        errorAlert={sinon.stub()}
        importInProgress={false}
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
        infoAlert={sinon.stub()}
        errorAlert={sinon.stub()}
        importInProgress={false}
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
        infoAlert={sinon.stub()}
        errorAlert={sinon.stub()}
        importInProgress={false}
      />,
    );

    component.find(SelectAccount).prop('onAccountSelected')('my account');

    assert(onAccountSelected.calledWith('my account'));
  });

  it('imports statement when import button clicked', () => {
    const statement = {
      transactions: [],
    };
    const onImport = sinon.stub().returns(Promise.resolve());
    const component = shallow(
      <Import
        onUpload={sinon.stub()}
        accounts={[]}
        statement={statement}
        onAccountSelected={sinon.stub()}
        selectedAccountId={'abc-123'}
        onImport={onImport}
        errorAlert={sinon.stub()}
        importInProgress={false}
      />,
    );

    component.find('.import-button').children().find(Button).simulate('click');

    assert(onImport.calledOnce);
  });
});
