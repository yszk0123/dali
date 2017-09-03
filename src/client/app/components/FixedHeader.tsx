import * as React from 'react';
import styled from '../styles/StyledComponents';

const Fixed = styled.div`position: fixed;`;

interface Props {
  height: number;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function FixedHeader({ height, fullWidth, children }: Props) {
  return (
    <div style={{ height }}>
      <Fixed style={{ height, width: fullWidth && '100%' }}>{children}</Fixed>
    </div>
  );
}
