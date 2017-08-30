/* @flow */
import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { Link } from 'react-router-dom';
import styled, { withTheme, ThemedProps } from '../styles/StyledComponents';
import { DateOnly } from '../interfaces';
import Day from './Day';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.4rem;
`;

const StyledDay = styled(Day)`
  font-size: 1.8rem;
  font-weight: bold;
`;

const GoToPreviousButton = styled(Link)`
  float: left;
  padding: ${({ theme }) => theme.goButton.space};
  cursor: pointer;
  text-decoration: none;
`;

const GoToNextButton = styled(Link)`
  float: left;
  padding: ${({ theme }) => theme.goButton.space};
  cursor: pointer;
  text-decoration: none;
`;

type Props = {
  date: DateOnly;
  previousLink: string;
  nextLink: string;
};

export default function DateSwitch({ date, previousLink, nextLink }: Props) {
  return (
    <Wrapper>
      <GoToPreviousButton to={previousLink}>
        &laquo; Previous
      </GoToPreviousButton>
      <StyledDay date={date} />
      <GoToNextButton to={nextLink}>Next &raquo;</GoToNextButton>
    </Wrapper>
  );
}
