/* @flow */
import React from 'react';

export default function Card({ title, children }) {
  return (
    <div>
      <h2>
        {title}
      </h2>
      {children}
    </div>
  );
}
