import * as React from 'react';
import { Color } from '../styles';
import Button from './Button';

interface Props {
  color: Color;
  icon: string;
  label: boolean;
  onIconClick: React.MouseEventHandler<HTMLElement>;
}

export default function IconButton({
  icon,
  label,
  onIconClick,
  ...rest,
}: Props) {
  return (
    <Button {...rest}>
      <i className={`fa fa-${icon}`} onClick={onIconClick} /> {label}
    </Button>
  );
}
