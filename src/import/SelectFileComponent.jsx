import React from 'react';
import { PropTypes } from 'prop-types';
import ReactFileReader from 'react-file-reader';
import readFile from './read-file';

const SelectFile = ({ onUpload }) => (
  <div className="select-file">
    <div className="import-form">
      <ReactFileReader handleFiles={files => readFile(files, onUpload)} fileTypes=".ofx">
        <button className="btn">Select file</button>
      </ReactFileReader>
    </div>
    <div className="import-instructions">
      <ol>
        <li>Download a statement from your bank</li>
        <li>Select the downloaded file</li>
      </ol>
    </div>
  </div>
);

SelectFile.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default SelectFile;
