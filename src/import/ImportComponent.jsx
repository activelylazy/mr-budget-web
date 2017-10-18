import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Grid, Row, Col, Panel, Glyphicon, Button } from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AlertContainer from 'react-alert';
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
      .then(() => this.msg.show('Statement imported successfully', {
        time: 2000,
        type: 'success',
      }));
  }
  render() {
    const { onUpload, statement, accounts,
      selectedAccountId, onAccountSelected } = this.props;
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
      if (selectedAccountId !== null) {
        content.push(importButton(this.doImport));
      }
    }
    const alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'light',
      time: 5000,
      transition: 'scale',
    };
    return (
      <div className="import-component">
        <AlertContainer ref={(a) => { this.msg = a; }} {...alertOptions} />
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
};

ImportComponent.defaultProps = {
  statement: null,
  selectedAccountId: null,
};

export default ImportComponent;
