import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
  graphql,
  compose,
  withApollo,
  ChildProps,
  QueryProps,
} from 'react-apollo';
import { LoginPageQuery } from 'schema';
import LoginMutation from '../../graphql/typeDefs/LoginMutation';
import * as loginPageQuery from '../../graphql/querySchema/LoginPage.graphql';
import Button from '../components/Button';

interface LoginPageProps {
  isLogin: boolean;
  from: any;
  onLogin(_: { email: string; password: string }): void;
}

type Props = QueryProps & LoginPageProps;

type State = {
  email: string;
  password: string;
};

export class LoginPage extends React.Component<
  ChildProps<Props, Response>,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  private handleLoginButtonClick = () => {
    this.login();
  };

  private handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;

    this.setState({ email });
  };

  private handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const password = event.target.value;

    this.setState({ password });
  };

  private login() {
    const { onLogin } = this.props;
    const { email, password } = this.state;

    if (!this.isValid()) {
      return;
    }

    onLogin({ email, password });
  }

  private isValid() {
    const { email, password } = this.state;

    return email && password;
  }

  render() {
    const { isLogin, from, onLogin } = this.props;
    const { email, password } = this.state;
    const canLogin = this.isValid();

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
          onChange={this.handleEmailChange}
        />
        <label htmlFor="password">Password: </label>
        <input
          id="password"
          type="text"
          value={password}
          onChange={this.handlePasswordChange}
        />
        <Button onClick={this.handleLoginButtonClick} disabled={!canLogin}>
          Login
        </Button>
        <Link to="/signup">Signup</Link>
      </div>
    );
  }
}

const withData = compose(
  graphql<Response & LoginPageQuery>(loginPageQuery, {
    props: ({ data }) => ({
      isLogin: data && data.currentUser,
    }),
  }),
  withApollo,
  graphql<
    Response,
    { client: any; location: any },
    Props
  >(LoginMutation.query, {
    props: ({ mutate, ownProps: { client, location } }) => ({
      from: (location.state && location.state.from) || { pathname: '/' },
      onLogin: async (input: { email: string; password: string }) => {
        await LoginMutation.commit(mutate, input);
        await client.resetStore();
      },
    }),
  }),
);

export default withData(LoginPage);
