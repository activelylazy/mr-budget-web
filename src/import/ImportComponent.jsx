import React from 'react';
import { PropTypes } from 'prop-types';
import { Grid, Row, Col, Panel, Glyphicon, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import ReactFileReader from 'react-file-reader';
import readFile from './read-file';
import './import.css';

function selectFile(onUpload) {
  return (
    <div key="select-file">
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
}

function selectAccount() {
  return (
    <div key="select-account">
      <div className="import-select-account">
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>Account</ControlLabel>
          <FormControl componentClass="select" placeholder="select">
            <option value="select">Choose account to import into</option>
            <option value="other">...</option>
          </FormControl>
        </FormGroup>
      </div>
    </div>
  );
}

const ImportComponent = ({ onUpload, statement }) => {
  const content = [];
  if (statement === undefined) {
    content.push(selectFile(onUpload));
  } else {
    content.push(selectAccount());
  }
  return (
    <div className="import-component">
      <Grid>
        <Row>
          <Col md={6}>
            <Panel
              header={(<span><Glyphicon glyph="import" /> Import Statement</span>)}
              bsStyle="info"
            >
              {content}
            </Panel>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

ImportComponent.propTypes = {
  onUpload: PropTypes.func.isRequired,
  statement: PropTypes.shape({
    transactions: PropTypes.array.isRequired,
  }),
};

ImportComponent.defaultProps = {
  statement: undefined,
};

export default ImportComponent;
