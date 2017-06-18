/* @flow */
import type { App_viewer } from './__generated__/App_viewer.graphql';
import React from 'react';
import styled from 'styled-components';
import { createFragmentContainer, graphql } from 'react-relay';
import ProjectList from './ProjectList';
import RoundList from './RoundList';

const Wrapper = styled.div`
  padding: 1rem;
`;

type Props = { viewer: App_viewer };
export function App({ viewer }: Props) {
  return (
    <Wrapper>
      <h1>Hello, {viewer.name}!</h1>
      <ProjectList viewer={viewer} />
      <RoundList viewer={viewer} />
    </Wrapper>
  );
}

export default createFragmentContainer(
  App,
  graphql`
    fragment App_viewer on User {
      id
      name
      ...ProjectList_viewer
      ...RoundList_viewer
    }
  `,
);
