/* @flow */
import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { Link } from 'react-router-dom';
import { styled, withTheme, ThemedProps } from '../styles';
import { DateOnly } from '../interfaces';
import FixedHeader from './FixedHeader';
import Day from './Day';

const HEIGHT = 32;
const Z_INDEX = 100;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  font-size: 1.4rem;
  background: white;
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
    <FixedHeader height={HEIGHT} fullWidth zIndex={Z_INDEX}>
      <Wrapper>
        <GoToPreviousButton to={previousLink}>
          &laquo; Previous
        </GoToPreviousButton>
        <StyledDay date={date} />
        <GoToNextButton to={nextLink}>Next &raquo;</GoToNextButton>
      </Wrapper>
    </FixedHeader>
  );
}
