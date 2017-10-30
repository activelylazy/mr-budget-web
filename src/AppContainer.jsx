import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import App from './AuthenticatedAppComponent';
import { loadUserData } from './user-data/user-data-thunk';
import { userLoggedIn } from './auth/auth-actions';
import { onBindAlert } from './app-actions';

class AppContainer extends Component {
  componentDidMount() {
    this.props.fakeLogin();
  }
  render() {
    if (this.props.auth !== undefined && this.props.auth.userId !== undefined) {
      return (
        <App
          area={this.props.area}
          loadUserData={this.props.loadUserData}
          auth={this.props.auth}
          onBindAlert={this.props.onBindAlert}
        />
      );
    }
    return (
      <div>Not logged in</div>
    );
  }
}

AppContainer.propTypes = {
  auth: PropTypes.shape({
    userId: PropTypes.string,
    password: PropTypes.string,
  }).isRequired,
  area: PropTypes.string.isRequired,
  loadUserData: PropTypes.func.isRequired,
  fakeLogin: PropTypes.func.isRequired,
  onBindAlert: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    area: state.navigation.area,
    auth: state.auth,
  };
}

const fakeLogin = () => dispatch => dispatch(userLoggedIn('49f6f8b6-5526-452f-9a5e-8af17c7acf06', 'Password1!'));

export default connect(mapStateToProps, { loadUserData, fakeLogin, onBindAlert })(AppContainer);
