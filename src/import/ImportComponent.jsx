import React from 'react';
import { PropTypes } from 'prop-types';
import { Grid, Row, Col, Panel, Glyphicon, Button } from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SelectFile from './SelectFileComponent';
import SelectAccount from './SelectAccountComponent';
import './import.css';

const importButton = () => (
  <div key="import-button" className="import-button">
    <Button bsStyle="primary">Import <Glyphicon glyph="chevron-right" /></Button>
  </div>
);

const ImportComponent = ({ onUpload, statement, accounts, selectedAccount, onAccountSelected }) => {
  const content = [];
  if (statement === null) {
    content.push((<SelectFile onUpload={onUpload} key="select-file" />));
  } else {
    content.push((
      <SelectAccount
        accounts={accounts}
        key="select-account"
        onAccountSelected={onAccountSelected}
      />));
    if (selectedAccount !== null) {
      content.push(importButton());
    }
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
  selectedAccount: PropTypes.string,
  onAccountSelected: PropTypes.func.isRequired,
};

ImportComponent.defaultProps = {
  statement: null,
  selectedAccount: null,
};

export default ImportComponent;
