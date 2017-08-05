/* @flow */
import React from 'react';

type Props = {
  children?: React.Element<*>,
};

export default function Dummy({ children }: Props) {
  return (
    <span>
      {children}
    </span>
  );
}
