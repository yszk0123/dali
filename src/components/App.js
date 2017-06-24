/* @flow */
import type { App_viewer } from './__generated__/App_viewer.graphql';
import React from 'react';
import styled from 'styled-components';
import { createFragmentContainer, graphql } from 'react-relay';
import ProjectList from './ProjectList';
import TimeUnitList from './TimeUnitList';

const Wrapper = styled.div`
  padding: 1rem;
`;

type Props = { viewer: App_viewer };
export function App({ viewer }: Props) {
  return (
    <Wrapper>
      <h1>Hello, {viewer.name}!</h1>
      <ProjectList viewer={viewer} />
      <TimeUnitList viewer={viewer} />
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
      ...TimeUnitList_viewer
    }
  `,
);
