import React from 'react';
import styled from 'styled-components';

const Label = styled.span`
  display: inline-block;
  font-size: 1.3rem;
  margin: 1rem;
  padding: 1rem;
  padding: 0.4rem;
  color: #111;
  cursor: pointer;
`;

export default function TaskLabel({
  icon,
  label,
  done,
  onLabelClick,
  onRemoveButtonClick,
  ...rest
}) {
  const displayText = done
    ? <del>
        {label}
      </del>
    : label;

  return (
    <Label {...rest}>
      <i className="fa fa-times-circle" onClick={onRemoveButtonClick} />{' '}
      <span onClick={onLabelClick}>{displayText}</span>
    </Label>
  );
}
