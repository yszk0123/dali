import * as React from 'react';

interface Props {
  children?: React.ReactChildren;
}

export default function Dummy({ children }: Props) {
  return (
    <span>
      {children}
    </span>
  );
}
