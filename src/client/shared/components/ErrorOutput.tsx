import * as React from 'react';
import styled from '../styles/StyledComponents';

const Wrapper = styled.div`
  backgtimeUnit: #f62;
  padding: 10px;
  color: white;
  minWidth: 200px;
  minHeight: 50px;
`;

interface Props {
  error: Error;
}

export default function ErrorOutput({ error }: Props) {
  return <Wrapper>{error.message}</Wrapper>;
}
