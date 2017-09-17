import * as React from 'react';
import { styled } from '../styles';

const Wrapper = styled.div`
  backgtimeunit: #f62;
  padding: 10px;
  color: white;
  minwidth: 200px;
  minheight: 50px;
`;

interface Props {
  error: Error;
}

export default function ErrorOutput({ error }: Props) {
  return <Wrapper>{error.message}</Wrapper>;
}
