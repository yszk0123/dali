import * as React from 'react';
import styled, { ThemedProps } from '../styles/StyledComponents';
import mapPositionToTimeRange from '../utils/mapPositionToTimeRange';

interface WrapperProps {
  activated: boolean;
}

const Wrapper = styled.span`
  font-size: ${({ theme }: ThemedProps<WrapperProps>) =>
    theme.timeLabel.fontSize};
  color: ${({ activated }) => (activated ? '#888' : '#b8b8b8')};
`;

interface Props {
  activated?: boolean;
  position: number;
}

export default function TimeLabel({ activated, position }: Props) {
  return (
    <Wrapper activated={!!activated}>
      {mapPositionToTimeRange(position)}
    </Wrapper>
  );
}
