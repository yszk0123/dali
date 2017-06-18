/* @flow */
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  background: #f62;
  padding: 10px;
  color: white;
  minWidth: 200px;
  minHeight: 50px;
`;

type Props = { error: Error };
export default function ErrorOutput({ error }: Props) {
  return (
    <Wrapper>
      {error.message}
    </Wrapper>
  );
}
