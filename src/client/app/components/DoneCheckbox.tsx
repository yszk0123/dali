import * as React from 'react';

interface Props {
  done?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export default function DoneCheckbox({ done, onChange }: Props) {
  return <input type="checkbox" checked={done} onChange={onChange} />;
}
