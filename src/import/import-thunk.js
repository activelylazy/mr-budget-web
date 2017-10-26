import parseOfx from '../ofx/parse-ofx';
import { statementUploaded } from './import-actions';
import { errorAlert } from '../app-actions';

export const readStatement = fileContents => dispatch => // eslint-disable-line
  parseOfx(fileContents)
    .then(statement => dispatch(statementUploaded(statement)))
    .catch(error => dispatch(errorAlert(`Error uploading statement: ${error}`)));

