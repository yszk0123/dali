import * as React from 'react';

interface Props {
  date: string;
}

export default function Day({ date, ...rest }: Props) {
  return <div {...rest}>{date}</div>;
}
