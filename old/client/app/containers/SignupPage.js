/* @flow */
import * as React from 'react';
import { Redirect } from 'react-router-dom';
import SignupMutation from '../../graphql/mutations/SignupMutation';

interface Props {
  viewer: any,
}

type State = {
  email: string,
  password: string,
};

export default class SignupPage extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      nickname: 'foo',
      firstName: 'bar',
      lastName: 'baz',
    };
  }

  _handleSignupButtonClick = () => {
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
    const { email, password, nickname, firstName, lastName } = this.state;

    if (!this._isValid()) {
      return;
    }

    SignupMutation.commit(relay.environment, {
      email,
      password,
      nickname,
      firstName,
      lastName,
    });
  }

  _isValid() {
    const { email, password, nickname, firstName, lastName } = this.state;

    return email && password && nickname && firstName && lastName;
  }

  render() {
    const { viewer, location } = this.props;
    const { email, password } = this.state;
    const from = (location.state && location.state.from) || { pathname: '/' };
    const canSignup = this._isValid();

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
        <button onClick={this._handleSignupButtonClick} disabled={!canSignup}>
          Signup
        </button>
      </div>
    );
  }
}
