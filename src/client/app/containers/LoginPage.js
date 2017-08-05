/* @flow */
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import type { OperationComponent, QueryProps } from 'react-apollo';
import { graphql, compose, withApollo } from 'react-apollo';
import type { LoginPageQuery } from 'schema.graphql';
import LoginMutation from '../../graphql/typeDefs/LoginMutation';
import loginPageQuery from '../../graphql/querySchema/LoginPage.graphql';
import Button from '../components/Button';

type Props = QueryProps & {
  isLogin: boolean,
  from: any,
  onLogin: ({ email: string, password: string }) => mixed,
};

type State = {
  email: string,
  password: string,
};

export class LoginPage extends React.Component {
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

  _handleEmailChange = (event: Event) => {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    const email = event.target.value;

    this.setState({ email });
  };

  _handlePasswordChange = (event: Event) => {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }
    const password = event.target.value;

    this.setState({ password });
  };

  _login() {
    const { onLogin } = this.props;
    const { email, password } = this.state;

    if (!this._isValid()) {
      return;
    }

    onLogin({ email, password });
  }

  _isValid() {
    const { email, password } = this.state;

    return email && password;
  }

  render() {
    const { isLogin, from } = this.props;
    const { email, password } = this.state;
    const canLogin = this._isValid();

    if (isLogin) {
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

const withData: OperationComponent<
  LoginPageQuery,
  { location: any },
  Props,
> = compose(
  graphql(loginPageQuery, {
    props: ({ data }) => ({
      isLogin: data && data.loading,
    }),
  }),
  withApollo,
  graphql(LoginMutation.query, {
    props: ({ mutate, ownProps: { client }, ownProps: { location } }) => ({
      from: (location.state && location.state.from) || { pathname: '/' },
      onLogin: async ({ email, password }) => {
        await LoginMutation.commit(mutate, { email, password });
        await client.resetStore();
      },
    }),
  }),
);

export default withData(LoginPage);
