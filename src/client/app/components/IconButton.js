import React from 'react';
import styled from 'styled-components';

const IconButtonWrapper = styled.span`
  margin: 3px;
  padding: 0.7rem;
  border-radius: 4px;
  background: #13c;
  color: #eee;
  cursor: pointer;
`;

export default function IconButton({ icon, label, ...rest }) {
  return (
    <IconButtonWrapper {...rest}>
      <i className={`fa fa-${icon}`} /> {label}
    </IconButtonWrapper>
  );
}
