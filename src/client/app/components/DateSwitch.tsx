/* @flow */
import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { Link } from 'react-router-dom';
import styled, { withTheme, ThemedProps } from '../styles/StyledComponents';
import { DateOnly } from '../interfaces';
import Day from './Day';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DayWrapper = styled.div`
  font-size: 140%;
  font-weight: bold;
`;

type Props = {
  date: DateOnly;
  previousLink: string;
  nextLink: string;
};

interface GoButtonProps {
  left?: boolean;
  right?: boolean;
  link: string;
  label: string;
}

const GoButton = withTheme<
  ThemedProps<GoButtonProps>
>(({ theme: { goButton }, left, right, link, label }) => {
  let style;
  if (left) {
    style = {
      float: 'left',
      padding: goButton.space,
      marginTop: `-${goButton.space}`,
      marginLeft: `-${goButton.space}`,
      cursor: 'pointer',
    };
  }
  if (right) {
    style = {
      float: 'right',
      padding: goButton.space,
      marginTop: `-${goButton.space}`,
      marginRight: goButton.space,
      cursor: 'pointer',
    };
  }

  return (
    <Link to={link}>
      <span style={style}>
        {label}
      </span>
    </Link>
  );
});

export default function DateSwitch({ date, previousLink, nextLink }: Props) {
  return (
    <Header>
      <GoButton left label="&laquo; Previous" link={previousLink} />
      <DayWrapper>
        <Day date={date} />
      </DayWrapper>
      <GoButton right label="Next &raquo;" link={nextLink} />
    </Header>
  );
}
