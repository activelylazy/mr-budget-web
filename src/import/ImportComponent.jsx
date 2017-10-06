import React from 'react';
import { PropTypes } from 'prop-types';
import { Grid, Row, Col, Panel, Glyphicon } from 'react-bootstrap';
import ReactFileReader from 'react-file-reader';
import readFile from './read-file';
import './import.css';

const ImportComponent = ({ onUpload }) => (
  <div className="import-component">
    <Grid>
      <Row>
        <Col md={6}>
          <Panel header={(<span><Glyphicon glyph="import" /> Import Statement</span>)} bsStyle="info">
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
          </Panel>
        </Col>
      </Row>
    </Grid>
  </div>
);

ImportComponent.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default ImportComponent;
