import React from 'react';
import Button from './Button';

export default function ClipboardButton({ target }) {
  return (
    <Button className="ClipboardButton" data-clipboard-target={target}>
      Copy to clipboard
    </Button>
  );
}
