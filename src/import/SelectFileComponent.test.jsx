import React from 'react';
import ReactFileReader from 'react-file-reader';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import sinon from 'sinon';
import SelectFile, { __RewireAPI__ as rewireApi } from './SelectFileComponent';

should();

describe('import component', () => {
  const readFileStub = sinon.stub();

  beforeEach(() => {
    rewireApi.__Rewire__('readFile', readFileStub);
  });

  it('calls onUpload callback when handleFiles triggered', () => {
    const onUploadStub = sinon.stub();
    const component = shallow(<SelectFile onUpload={onUploadStub} />);
    const files = sinon.stub();

    const handleFiles = component.find(ReactFileReader).prop('handleFiles');
    handleFiles(files);

    assert(readFileStub.calledWith(files, onUploadStub));
  });
});
