import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

export function DailyReportPage({ viewer }) {
  return <div>Markdown will be generated here</div>;
}

export default createFragmentContainer(
  DailyReportPage,
  graphql`
    fragment DailyReportPage_viewer on User {
      id
    }
  `,
);
