import * as React from 'react';
import styled, { ThemedProps } from '../styles/StyledComponents';
import Theme from '../constants/Theme';

interface Props {
  onClick: React.MouseEventHandler<HTMLElement>;
}

export default styled.div`
  font-size: ${({ theme }) => theme.shared.fontSize};
  margin-bottom: ${({ theme }) => theme.shared.marginBottom};
  align-content: center;
  cursor: ${({ onClick }: ThemedProps<Props>) =>
    onClick ? 'pointer' : 'initial'};
`;
