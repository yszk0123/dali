/* @flow */
import React from 'react';

type Props = {
  title: string,
  children: React.Element<*>,
};

export default function Card({ title, children }: Props) {
  return (
    <div>
      <h2>
        {title}
      </h2>
      {children}
    </div>
  );
}
