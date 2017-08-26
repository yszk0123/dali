import * as React from 'react';

interface Props {
  date: string;
}

export default function Day({ date }: Props) {
  return (
    <div>
      {date}
    </div>
  );
}
