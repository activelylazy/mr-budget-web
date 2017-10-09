import React from 'react';
import { PropTypes } from 'prop-types';
import { Grid, Row, Col, Panel, Glyphicon, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import ReactFileReader from 'react-file-reader';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import readFile from './read-file';
import './import.css';

function selectFile(onUpload) {
  return (
    <div key="select-file" className="select-file">
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

function selectAccount(accounts) {
  const accountOptions = accounts.map(account => (
    <option>{account.name}</option>
  ));
  return (
    <div key="select-account" className="select-account">
      <div className="import-select-account">
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>Account</ControlLabel>
          <FormControl componentClass="select" placeholder="select">
            <option value="select">Choose account to import into</option>
            {accountOptions}
          </FormControl>
        </FormGroup>
      </div>
    </div>
  );
}

const ImportComponent = ({ onUpload, statement, accounts }) => {
  const content = [];
  if (statement === undefined) {
    content.push(selectFile(onUpload));
  } else {
    content.push(selectAccount(accounts));
  }
  return (
    <div className="import-component">
      <Grid>
        <Row>
          <Col md={6}>
            <Panel
              header={(<span><Glyphicon glyph="import" /> Import Statement</span>)}
              bsStyle="info"
              className="import-panel"
            >
              <ReactCSSTransitionGroup
                transitionName="import-transition"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}
              >
                {content}
                <div key="import-button" className="import-button">
                  <Button bsStyle="primary">Import <Glyphicon glyph="chevron-right" /></Button>
                </div>
              </ReactCSSTransitionGroup>
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
  accounts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
};

ImportComponent.defaultProps = {
  statement: undefined,
};

export default ImportComponent;
