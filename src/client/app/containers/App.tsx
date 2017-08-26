import * as React from 'react';
import { graphql, QueryProps } from 'react-apollo';
import { AppQuery } from 'schema';
import * as appQuery from '../../graphql/querySchema/App.graphql';
import ErrorOutput from '../components/ErrorOutput';
import LoadingIndicator from '../components/LoadingIndicator';
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

const withData = graphql<Response & AppQuery, {}, Props>(appQuery, {
  props: ({ data }) => ({
    ...data,
    ...data && data.currentUser,
    isLogin: data && data.currentUser,
  }),
});

export default withData(App);
