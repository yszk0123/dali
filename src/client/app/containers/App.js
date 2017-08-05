/* @flow */
import React from 'react';
import { graphql } from 'react-apollo';
import type { OperationComponent, QueryProps } from 'react-apollo';
import type { AppQuery } from 'schema.graphql';
import appQuery from '../../graphql/querySchema/App.graphql';
import ErrorOutput from '../components/ErrorOutput';
import LoadingIndicator from '../components/LoadingIndicator';
import Routes from './Routes';

type Props = {
  ...QueryProps,
  ...AppQuery,
  nickname: string,
  isLogin: boolean,
};

const withData: OperationComponent<AppQuery, {}, Props> = graphql(appQuery, {
  props: ({ data }) => ({
    ...data,
    ...data.currentUser,
    isLogin: data && data.currentUser,
  }),
});

export function App({
  nickname,
  error,
  loading,
  isLogin,
  networkStatus,
}: Props) {
  if (error) {
    return <ErrorOutput error={error} />;
  }

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      <h1>
        Hello {networkStatus}
      </h1>
      {isLogin &&
        <h1>
          Hello, {nickname}!
        </h1>}
      <Routes />
    </div>
  );
}

export default withData(App);
