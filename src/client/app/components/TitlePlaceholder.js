import React from 'react';
import styled from 'styled-components';

const Placeholder = styled.span`
  display: inline-block;
  padding: 0.4rem 1.2rem;
  border-bottom: 1px solid #ccc;
  color: ${({ nolabel }) => (nolabel ? '#888' : '#111')};
`;

export default function TitlePlaceholder({
  label,
  defaultLabel = 'No Title',
  onClick,
}) {
  if (!label) {
    return (
      <Placeholder nolabel onClick={onClick}>
        {defaultLabel}
      </Placeholder>
    );
  }

  return (
    <Placeholder onClick={onClick}>
      {label}
    </Placeholder>
  );
}
