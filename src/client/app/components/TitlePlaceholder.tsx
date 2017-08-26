import * as React from 'react';
import styled from '../styles/StyledComponents';

const Placeholder = styled.span`
  display: inline-block;
  padding: 0.4rem 1.2rem;
  border-bottom: 1px solid #ccc;
  color: ${({ nolabel }: { nolabel?: boolean }) => (nolabel ? '#888' : '#111')};
`;

interface Props {
  label: string | null;
  defaultLabel?: string;
  onClick: React.MouseEventHandler<HTMLElement>;
}

export default function TitlePlaceholder({
  defaultLabel = 'No Title',
  label,
  onClick,
}: Props) {
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
