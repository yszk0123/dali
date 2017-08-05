/* @flow */
import React from 'react';
import Button from './Button';

type Props = {
  target: string,
};

export default function ClipboardButton({ target }: Props) {
  return (
    <Button className="ClipboardButton" data-clipboard-target={target}>
      Copy to clipboard
    </Button>
  );
}
