import React from 'react';

export default function ClipboardButton({ target }) {
  return (
    <button className="ClipboardButton" data-clipboard-target={target}>
      Copy to clipboard
    </button>
  );
}
