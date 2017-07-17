import React from 'react';
import Button from './Button';

export default function IconButton({ icon, label, onIconClick, ...rest }) {
  return (
    <Button {...rest}>
      <i className={`fa fa-${icon}`} onClick={onIconClick} /> {label}
    </Button>
  );
}
