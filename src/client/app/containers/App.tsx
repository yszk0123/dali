import * as React from 'react';
import { graphql, QueryProps } from 'react-apollo';
import { AppQuery as Query } from 'schema';
import * as QUERY from '../querySchema/App.graphql';
import { ErrorOutput, LoadingIndicator } from '../../shared/components';
import Routes from './Routes';

type Props = QueryProps &
  Query & {
    nickname: string;
    isLogin: boolean;
  };

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

  return <Routes />;
}

const withData = graphql<Response & Query, {}, Props>(QUERY, {
  props: ({ data }) => ({
    ...data,
    ...(data && data.currentUser),
    isLogin: data && data.currentUser,
  }),
});

export default withData(App);
