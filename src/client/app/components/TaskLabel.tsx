import * as React from 'react';
import styled from '../styles/StyledComponents';
import Icon from './Icon';

const Side = styled.div`
  padding: 0.4rem;
  font-size: 0.8rem;
  color: gray;
`;

const Label = styled.div`
  font-size: 1.6rem;
  padding: 0.8rem;
  color: #111;
  cursor: pointer;
`;

interface Props {
  icon: string;
  label: string;
  subLabel?: string | null;
  done: boolean;
  onLabelClick: React.MouseEventHandler<HTMLElement>;
  onRemoveButtonClick: React.MouseEventHandler<HTMLElement>;
}

export default function TaskLabel({
  icon,
  label,
  subLabel,
  done,
  onLabelClick,
  onRemoveButtonClick,
  ...rest,
}: Props) {
  const displayText = done
    ? <del>
        {label}
      </del>
    : label;

  return (
    <Label {...rest}>
      {subLabel &&
        <Side>
          {subLabel}
        </Side>}
      <Icon
        color="primary"
        icon="times-circle"
        onClick={onRemoveButtonClick}
      />{' '}
      <span onClick={onLabelClick}>{displayText}</span>
    </Label>
  );
}
