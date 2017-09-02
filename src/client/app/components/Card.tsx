import * as React from 'react';

interface Props {
  title: string;
  children: React.ReactChildren;
}

export default function Card({ title, children }: Props) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
