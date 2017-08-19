/* @flow */
import React from 'react';
import styled from 'styled-components';

function mapPositionToTimeRange(position) {
  const odd = position % 2 === 0;
  const startHour = Math.floor(position / 2);
  const endHour = odd ? startHour : startHour + 1;
  const startMinute = odd ? '00' : '30';
  const endMinute = !odd ? '00' : '30';

  return `${startHour}:${startMinute}~${endHour}:${endMinute}`;
}

const Wrapper = styled.span`
  font-size: ${({ theme }) => theme.timeLabel.fontSize};
  color: #aaa;
`;

type Props = {
  position: number,
};

export default function Time({ position }: Props) {
  return (
    <Wrapper>
      {mapPositionToTimeRange(position)}
    </Wrapper>
  );
}
