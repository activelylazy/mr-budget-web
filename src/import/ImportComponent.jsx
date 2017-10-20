import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Grid, Row, Col, Panel, Glyphicon, Button } from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SelectFile from './SelectFileComponent';
import SelectAccount from './SelectAccountComponent';
import './import.css';

const importButton = onImport => (
  <div key="import-button" className="import-button">
    <Button bsStyle="primary" onClick={onImport}>Import <Glyphicon glyph="chevron-right" /></Button>
  </div>
);

class ImportComponent extends Component {
  constructor() {
    super();
    this.doImport = this.doImport.bind(this);
  }
  doImport() {
    this.props.onImport()
      .then(() => this.props.showSuccess('Statement imported'));
  }
  render() {
    const { onUpload, statement, accounts,
      selectedAccountId, onAccountSelected,
      importInProgress } = this.props;
    const content = [];
    if (statement === null) {
      content.push((<SelectFile onUpload={onUpload} key="select-file" />));
    } else if (importInProgress) {
      content.push((
        <div key="import-in-progress">
          Statement is being imported...
          <div className="progress progress-striped active">
            <div className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{ width: '100%' }} />
          </div>
        </div>
      ));
    } else {
      content.push((
        <SelectAccount
          accounts={accounts}
          key="select-account"
          onAccountSelected={onAccountSelected}
        />));
      if (selectedAccountId !== null) {
        content.push(importButton(this.doImport));
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
  }
}

ImportComponent.propTypes = {
  onUpload: PropTypes.func.isRequired,
  statement: PropTypes.shape({
    transactions: PropTypes.array.isRequired,
  }),
  accounts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
  selectedAccountId: PropTypes.string,
  onAccountSelected: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  showSuccess: PropTypes.func.isRequired,
  importInProgress: PropTypes.bool.isRequired,
};

ImportComponent.defaultProps = {
  statement: null,
  selectedAccountId: null,
};

export default ImportComponent;
