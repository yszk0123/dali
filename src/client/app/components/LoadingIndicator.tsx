import * as React from 'react';
import styled from 'styled-components';

const Center = styled.div`
  display: flex;
  position: absolute;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

export default function Loading() {
  return (
    <Center>
      <i className="fa fa-spinner fa-pulse fa-5x fa-fw" />
      <span className="sr-only">Loading</span>
    </Center>
  );
}
