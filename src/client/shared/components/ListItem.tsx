import * as React from 'react';
import { styled, ThemedProps } from '../styles';
import { Theme } from '../constants';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.8rem;
`;

const Main = styled.div`flex-grow: 1;`;

interface Props {
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function ListItem({ leftIcon, rightIcon, children }: Props) {
  return (
    <Wrapper>
      {leftIcon}
      <Main>{children}</Main>
      {rightIcon}
    </Wrapper>
  );
}
