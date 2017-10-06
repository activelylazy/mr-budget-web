import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Import from './ImportComponent';
import { uploadStatement } from './import-actions';

const ImportContainer = props => (
  <Import onUpload={props.uploadStatement} />
);

ImportContainer.propTypes = {
  uploadStatement: PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {

  };
}

export default connect(mapStateToProps, { uploadStatement })(ImportContainer);
