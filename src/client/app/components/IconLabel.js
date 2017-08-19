/* @flow */
import React from 'react';
import styled from 'styled-components';

const Label = styled.span`
  display: inline-block;
  font-size: 1.3rem;
  margin: 3px;
  padding: 1rem;
  padding: 0.4rem;
  border-bottom: 1px solid #ccc;
  color: #111;
`;

type Props = {
  icon: string,
  label: boolean,
  onIconClick: EventHandler,
};

export default function IconLabel({
  icon,
  label,
  onIconClick,
  ...rest
}: Props) {
  return (
    <Label {...rest}>
      <i className={`fa fa-${icon}`} onClick={onIconClick} /> {label}
    </Label>
  );
}
