import React from 'react';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import sinon from 'sinon';
import Import from './ImportComponent';
import SelectFile from './SelectFileComponent';

should();

describe('import component', () => {
  it('renders upload button initially', () => {
    const component = shallow(<Import onUpload={sinon.stub()} accounts={[]} />);

    assert(component.find(SelectFile).should.exist);
  });
});
