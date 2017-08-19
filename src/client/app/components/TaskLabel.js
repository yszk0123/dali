/* @flow */
import React from 'react';
import styled from 'styled-components';
import Icon from './Icon';

const Label = styled.span`
  display: inline-block;
  font-size: 1.6rem;
  margin: 1rem;
  padding: 0.8rem;
  color: #111;
  cursor: pointer;
`;

type Props = {
  icon: string,
  label: boolean,
  done: boolean,
  onLabelClick: EventHandler,
  onRemoveButtonClick: EventHandler,
};

export default function TaskLabel({
  icon,
  label,
  done,
  onLabelClick,
  onRemoveButtonClick,
  ...rest
}: Props) {
  const displayText = done
    ? <del>
        {label}
      </del>
    : label;

  return (
    <Label {...rest}>
      <Icon
        clolor="primary"
        icon="times-circle"
        onClick={onRemoveButtonClick}
      />{' '}
      <span onClick={onLabelClick}>{displayText}</span>
    </Label>
  );
}
