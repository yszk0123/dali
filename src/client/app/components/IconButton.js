/* @flow */
import React from 'react';
import Button from './Button';

type Props = {
  icon: string,
  label: boolean,
  onIconClick: EventHandler,
};

export default function IconButton({
  icon,
  label,
  onIconClick,
  ...rest
}: Props) {
  return (
    <Button {...rest}>
      <i className={`fa fa-${icon}`} onClick={onIconClick} /> {label}
    </Button>
  );
}
