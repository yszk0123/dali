import React from 'react';
import styled from 'styled-components';

const I = styled.i`
  color: ${({ theme, color }) => theme.icon[color].color};
  font-size: ${({ large }) => (large ? '1.6rem' : 'inherit')};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'initial')};
`;

I.defaultProps = {
  color: 'default',
};

export default function Icon({ icon, large, color, onClick }) {
  return (
    <I
      color={color}
      large={large}
      className={`fa fa-${icon}`}
      onClick={onClick}
    />
  );
}
