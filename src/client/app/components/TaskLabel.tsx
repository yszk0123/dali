import * as React from 'react';
import styled from '../styles/StyledComponents';
import Icon from './Icon';
import DoneCheckbox from './DoneCheckbox';
import TitleInput from './TitleInput';

const SubLabel = styled.div`
  padding: 0.4rem 0;
  font-size: 0.8rem;
  color: gray;
`;

const Label = styled.div`
  display: flex;
  width: 100%;
  padding: 0.6rem 0.8rem;
  align-items: center;
  color: #111;
`;

const Content = styled.div`
  flex-grow: 4;
  padding: 0 2.4rem 0 0.8rem;
`;

const RightSideIcon = styled(Icon)`
  flex-grow: 1;
`;

interface Props {
  label: string;
  subLabel?: string | null;
  done: boolean;
  onCheckboxChange: React.ChangeEventHandler<HTMLInputElement>;
  onLabelChange(title: string): void;
  onRemoveButtonClick: React.MouseEventHandler<HTMLElement>;
}

export default function TaskLabel({
  label,
  subLabel,
  done,
  onCheckboxChange,
  onLabelChange,
  onRemoveButtonClick,
  ...rest,
}: Props) {
  return (
    <Label {...rest}>
      <DoneCheckbox done={done} onChange={onCheckboxChange} />
      <Content>
        {subLabel &&
          <SubLabel>
            {subLabel}
          </SubLabel>}
        <TitleInput fullWidth title={label} onChange={onLabelChange} />
      </Content>
      <RightSideIcon icon="archive" onClick={onRemoveButtonClick} />
    </Label>
  );
}
