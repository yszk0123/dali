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
import * as LoginMutation from '../../graphql/mutations/LoginMutation';
import * as loginPageQuery from '../../graphql/querySchema/LoginPage.graphql';
import Button from '../components/Button';

interface LoginPageProps {
  isLogin: boolean;
  from: any;
  login(_: { email: string; password: string }): void;
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
    const { login } = this.props;
    const { email, password } = this.state;

    if (!this.isValid()) {
      return;
    }

    login({ email, password });
  }

  private isValid() {
    const { email, password } = this.state;

    return email && password;
  }

  render() {
    const { isLogin, from, login } = this.props;
    const { email, password } = this.state;
    const canLogin = this.isValid();

    if (isLogin) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <label htmlFor="email">Email: </label>
        <input
          name="email"
          type="email"
          value={email}
          onChange={this.handleEmailChange}
        />
        <label htmlFor="password">Password: </label>
        <input
          name="password"
          type="password"
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
  >(LoginMutation.mutation, {
    props: ({ mutate, ownProps: { client, location } }) => ({
      from: (location.state && location.state.from) || { pathname: '/' },
      login: async (input: { email: string; password: string }) => {
        mutate && (await mutate(LoginMutation.buildMutationOptions(input)));
        await client.resetStore();
      },
    }),
  }),
);

export default withData(LoginPage);
