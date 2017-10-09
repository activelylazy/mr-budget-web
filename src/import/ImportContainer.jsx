import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Import from './ImportComponent';
import { importStatement } from './import-actions';

const ImportContainer = props => (
  <Import onUpload={props.importStatement} statement={props.statement} />
);

ImportContainer.propTypes = {
  importStatement: PropTypes.func.isRequired,
  statement: PropTypes.shape({
    transactions: PropTypes.array.isRequired,
  }),
};

ImportContainer.defaultProps = {
  statement: undefined,
};


function mapStateToProps(state) {
  return {
    statement: state.statementImport.statement,
  };
}

export default connect(mapStateToProps, { importStatement })(ImportContainer);
