import * as React from 'react';
import { styled, Color, ThemedProps } from '../styles';

interface IProps {
  color?: Color;
  cursor?: boolean;
  large?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const I = styled.i`
  color: ${({ theme, color = 'default' }: ThemedProps<IProps>) =>
    theme.icon[color].color};
  font-size: ${({ large }) => (large ? '1.6rem' : 'inherit')};
  cursor: ${({ cursor, onClick }) =>
    cursor || onClick ? 'pointer' : 'initial'};
`;

I.defaultProps = {
  color: 'default',
};

type Props = IProps & {
  icon: string;
};

export default function Icon({ cursor, icon, large, color, onClick }: Props) {
  return (
    <I
      cursor={cursor}
      color={color}
      large={large}
      className={`fa fa-${icon}`}
      onClick={onClick}
    />
  );
}
