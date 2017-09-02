import * as React from 'react';
import styled, { ThemedProps } from '../styles/StyledComponents';
import Theme from '../constants/Theme';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.8rem;
`;

const Main = styled.div`flex-grow: 1;`;

interface Props {
  children: React.ReactChild;
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
