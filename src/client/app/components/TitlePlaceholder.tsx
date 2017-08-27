import * as React from 'react';
import styled from '../styles/StyledComponents';

interface PlaceholderProps {
  fullWidth?: boolean;
  nolabel?: boolean;
}
const Placeholder = styled.span`
  display: ${({ fullWidth }: PlaceholderProps) =>
    fullWidth ? 'block' : 'inline-block'};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '')};
  padding: 0.4rem 0.8rem;
  border-bottom: 1px solid #e4eaf7;
  color: ${({ nolabel }) => (nolabel ? '#888' : '#111')};
`;

interface Props {
  label: string | null;
  fullWidth?: boolean;
  defaultLabel?: string;
  onClick: React.MouseEventHandler<HTMLElement>;
}

export default function TitlePlaceholder({
  defaultLabel = 'No Title',
  fullWidth,
  label,
  onClick,
}: Props) {
  if (!label) {
    return (
      <Placeholder nolabel fullWidth={fullWidth} onClick={onClick}>
        {defaultLabel}
      </Placeholder>
    );
  }

  return (
    <Placeholder fullWidth={fullWidth} onClick={onClick}>
      {label}
    </Placeholder>
  );
}
