/* @flow */
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import LoginMutation from '../../graphql/mutations/LoginMutation';
import Button from '../components/Button';

type Props = {
  viewer: any,
};

type State = {
  email: string,
  password: string,
};

export default class LoginPage extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  _handleLoginButtonClick = () => {
    this._login();
  };

  _handleEmailChange = event => {
    const email = event.target.value;

    this.setState({ email });
  };

  _handlePasswordChange = event => {
    const password = event.target.value;

    this.setState({ password });
  };

  _login() {
    const { relay } = this.props;
    const { email, password } = this.state;

    if (!this._isValid()) {
      return;
    }

    LoginMutation.commit(relay.environment, { email, password });
  }

  _isValid() {
    const { email, password } = this.state;

    return email && password;
  }

  render() {
    const { viewer, location } = this.props;
    const { email, password } = this.state;
    const from = (location.state && location.state.from) || { pathname: '/' };
    const canLogin = this._isValid();

    if (viewer) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <label htmlFor="email">Email: </label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={this._handleEmailChange}
        />
        <label htmlFor="password">Password: </label>
        <input
          id="password"
          type="text"
          value={password}
          onChange={this._handlePasswordChange}
        />
        <Button onClick={this._handleLoginButtonClick} disabled={!canLogin}>
          Login
        </Button>
        <Link to="/signup">Signup</Link>
      </div>
    );
  }
}
