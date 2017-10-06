import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Import from './ImportComponent';
import { importStatement } from './import-actions';

const ImportContainer = props => (
  <Import onUpload={props.importStatement} />
);

ImportContainer.propTypes = {
  importStatement: PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {

  };
}

export default connect(mapStateToProps, { importStatement })(ImportContainer);
