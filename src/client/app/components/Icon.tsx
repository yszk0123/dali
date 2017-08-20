import * as React from 'react';
import styled from 'styled-components';

const I = styled.i`
  color: ${({ theme, color }) => theme.icon[color].color};
  font-size: ${({ large }: { large: boolean }) =>
    large ? '1.6rem' : 'inherit'};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'initial')};
`;

I.defaultProps = {
  color: 'default',
};

interface Props {
  icon: string;
  large?: boolean;
  color?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export default function Icon({ icon, large, color, onClick }: Props) {
  return (
    <I
      color={color}
      large={large}
      className={`fa fa-${icon}`}
      onClick={onClick}
    />
  );
}
