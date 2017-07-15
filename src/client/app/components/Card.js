/* @flow */
import React from 'react';
import styled from 'styled-components';

const Detail = styled.div`margin-left: 2rem;`;

export default function Card({ title, children }) {
  return (
    <div>
      <h2>
        {title}
      </h2>
      <Detail>
        {children}
      </Detail>
    </div>
  );
}
