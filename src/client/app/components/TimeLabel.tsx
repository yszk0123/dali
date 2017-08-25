import * as React from 'react';
import styled, { ThemedProps } from '../styles/StyledComponents';

function mapPositionToTimeRange(position: number): string {
  const odd = position % 2 === 0;
  const startHour = Math.floor(position / 2);
  const endHour = odd ? startHour : startHour + 1;
  const startMinute = odd ? '00' : '30';
  const endMinute = !odd ? '00' : '30';

  return `${startHour}:${startMinute}~${endHour}:${endMinute}`;
}

const Wrapper = styled.span`
  font-size: ${({ theme }: ThemedProps) => theme.timeLabel.fontSize};
  color: #aaa;
`;

interface Props {
  position: number;
}

export default function Time({ position }: Props) {
  return (
    <Wrapper>
      {mapPositionToTimeRange(position)}
    </Wrapper>
  );
}
