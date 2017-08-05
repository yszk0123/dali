/* @flow */
import React from 'react';

type Props = {
  done: boolean,
  onChange: () => mixed,
};
export default function DoneCheckbox({ done, onChange }: Props) {
  return <input type="checkbox" checked={done} onChange={onChange} />;
}
