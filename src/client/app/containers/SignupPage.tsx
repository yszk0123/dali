import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
  graphql,
  compose,
  withApollo,
  ChildProps,
  QueryProps,
} from 'react-apollo';
import { SignupPageQuery } from 'schema';
import * as SignupMutation from '../../graphql/mutations/SignupMutation';
import * as signupPageQuery from '../../graphql/querySchema/SignupPage.graphql';
import Button from '../components/Button';

interface SignupPageProps {
  isSignup: boolean;
  from: any;
  signup(input: SignupMutation.MutationVariables): void;
}

type Props = QueryProps & SignupPageProps;

type State = {
  email: string;
  password: string;
  nickname: string;
  firstName: string | null;
  lastName: string | null;
};

export class SignupPage extends React.Component<
  ChildProps<Props, Response>,
  State
> {
  state = {
    email: '',
    password: '',
    nickname: '',
    firstName: null,
    lastName: null,
  };

  private handleSignupButtonClick = () => {
    this.signup();
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

  private handleNicknameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nickname = event.target.value;

    this.setState({ nickname });
  };

  private signup() {
    const { signup } = this.props;
    const { email, password, nickname, firstName, lastName } = this.state;

    if (!this.isValid()) {
      return;
    }

    signup({ email, password, nickname, firstName, lastName });
  }

  private isValid() {
    const { email, password, nickname } = this.state;

    return email && password && nickname;
  }

  render() {
    const { isSignup, from, signup } = this.props;
    const { email, password, nickname } = this.state;
    const canSignup = this.isValid();

    if (isSignup) {
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
        <label htmlFor="nickname">Nickname: </label>
        <input
          name="nickname"
          type="text"
          value={nickname}
          onChange={this.handleNicknameChange}
        />
        <Button onClick={this.handleSignupButtonClick} disabled={!canSignup}>
          Signup
        </Button>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}

const withData = compose(
  graphql<Response & SignupPageQuery>(signupPageQuery, {
    props: ({ data }) => ({
      isSignup: data && data.currentUser,
    }),
  }),
  withApollo,
  graphql<
    Response,
    { client: any; location: any },
    Props
  >(SignupMutation.mutation, {
    props: ({ mutate, ownProps: { client, location } }) => ({
      from: (location.state && location.state.from) || { pathname: '/' },
      signup: async (input: SignupMutation.MutationVariables) => {
        mutate && (await mutate(SignupMutation.buildMutationOptions(input)));
        await client.resetStore();
      },
    }),
  }),
);

export default withData(SignupPage);
