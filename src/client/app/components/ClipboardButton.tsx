import * as React from 'react';
import Button from './Button';

interface Props {
  target: string;
}

export default function ClipboardButton({ target }: Props) {
  return (
    <Button className="ClipboardButton" data-clipboard-target={target}>
      Copy to clipboard
    </Button>
  );
}
