import * as React from 'react';
import styled, { ThemedProps } from '../styles/StyledComponents';

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

function mapPositionToTimeRange(position: number): string {
  const odd = position % 2 === 0;
  const startHour = Math.floor(position / 2);
  const endHour = odd ? startHour : startHour + 1;
  const startMinute = odd ? '00' : '30';
  const endMinute = !odd ? '00' : '30';

  return `${startHour}:${startMinute}~${endHour}:${endMinute}`;
}
