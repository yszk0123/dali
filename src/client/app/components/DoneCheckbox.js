/* @flow */
import React from 'react';

export default function DoneCheckbox({ done, onChange }) {
  return <input type="checkbox" checked={done} onChange={onChange} />;
}
