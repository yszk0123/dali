import * as React from 'react';
import styled, { Color, ThemedProps } from '../styles/StyledComponents';

interface IProps {
  color?: Color;
  large?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const I = styled.i`
  color: ${({ theme, color = 'default' }: ThemedProps<IProps>) =>
    theme.icon[color].color};
  font-size: ${({ large }) => (large ? '1.6rem' : 'inherit')};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'initial')};
`;

I.defaultProps = {
  color: 'default',
};

interface Props {
  icon: string;
  large?: boolean;
  color?: Color;
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
