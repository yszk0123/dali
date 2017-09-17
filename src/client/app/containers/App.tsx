import * as React from 'react';
import { graphql, QueryProps } from 'react-apollo';
import { AppQuery } from 'schema';
import * as APP_QUERY from '../querySchema/App.graphql';
import { ErrorOutput, LoadingIndicator } from '../../shared/components';
import Routes from './Routes';

interface AppProps {
  nickname: string;
  isLogin: boolean;
}

type Props = QueryProps & AppQuery & AppProps;

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

const withData = graphql<Response & AppQuery, {}, Props>(APP_QUERY, {
  props: ({ data }) => ({
    ...data,
    ...(data && data.currentUser),
    isLogin: data && data.currentUser,
  }),
});

export default withData(App);
