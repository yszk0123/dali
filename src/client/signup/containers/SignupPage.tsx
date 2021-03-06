import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
  graphql,
  compose,
  withApollo,
  ChildProps,
  QueryProps,
} from 'react-apollo';
import { SignupPageQuery as Query } from 'schema';
import { styled } from '../../shared/styles';
import { Signup } from '../mutations';
import * as QUERY from '../querySchema/SignupPage.graphql';
import { Button } from '../../shared/components';

const Wrapper = styled.div`font-size: 1.6rem;`;

type Props = QueryProps & {
  isSignup: boolean;
  from: any;
  signup(input: Signup.MutationVariables): void;
};

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
      <Wrapper>
        <div>
          <label htmlFor="email">Email </label>
          <input
            name="email"
            type="email"
            value={email}
            onChange={this.handleEmailChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password </label>
          <input
            name="password"
            type="password"
            value={password}
            onChange={this.handlePasswordChange}
          />
        </div>
        <div>
          <label htmlFor="nickname">Nickname </label>
          <input
            name="nickname"
            type="text"
            value={nickname}
            onChange={this.handleNicknameChange}
          />
        </div>
        <div>
          <Button
            color="primary"
            onClick={this.handleSignupButtonClick}
            disabled={!canSignup}
          >
            Signup
          </Button>
          <Link to="/login">Login</Link>
        </div>
      </Wrapper>
    );
  }
}

const withData = compose(
  graphql<Response & Query>(QUERY, {
    props: ({ data }) => ({
      isSignup: data && data.currentUser,
    }),
  }),
  withApollo,
  graphql<Response, { client: any; location: any }, Props>(Signup.mutation, {
    props: ({ mutate, ownProps: { client, location } }) => ({
      from: (location.state && location.state.from) || { pathname: '/' },
      signup: async (input: Signup.MutationVariables) => {
        mutate && (await mutate(Signup.build(input)));
        await client.resetStore();
      },
    }),
  }),
);

export default withData(SignupPage);
