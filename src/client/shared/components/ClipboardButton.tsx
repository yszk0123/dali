import * as React from 'react';
import { Color } from '../styles';
import Button from './Button';

interface Props {
  color: Color;
  target: string;
}

export default function ClipboardButton({ color, target }: Props) {
  return (
    <Button
      color={color}
      className="ClipboardButton"
      data-clipboard-target={target}
    >
      Copy to clipboard
    </Button>
  );
}
