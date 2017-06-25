import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

export function TaskUnitItem({ taskUnit }) {
  return <div>{taskUnit.title}</div>;
}

export default createFragmentContainer(
  TaskUnitItem,
  graphql`
    fragment TaskUnitItem_taskUnit on TaskUnit {
      title
    }
  `,
);
