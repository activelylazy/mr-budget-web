import React from 'react';
import ReactFileReader from 'react-file-reader';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import sinon from 'sinon';
import Import, { __RewireAPI__ as rewireApi } from './ImportComponent';

should();

describe('import component', () => {
  const readFileStub = sinon.stub();

  beforeEach(() => {
    rewireApi.__Rewire__('readFile', readFileStub);
  });

  it('renders upload button initially', () => {
    const component = shallow(<Import onUpload={sinon.stub()} />);

    assert(component.find('.import-instructions').should.exist);
    assert(component.find('.btn').should.exist);
  });

  it('reads file and fires upload statement action', () => {
    const onUploadStub = sinon.stub();
    const component = shallow(<Import onUpload={onUploadStub} />);
    const files = sinon.stub();

    const handleFiles = component.find(ReactFileReader).prop('handleFiles');
    handleFiles(files);

    assert(readFileStub.calledWith(files, onUploadStub));
  });
});
