import { styled, ThemedProps } from '../styles';

interface Props {
  fullWidth?: boolean;
}

export default styled.div`
  display: flex;
  flex-direction: column;
  display: ${({ fullWidth }: ThemedProps<Props>) => (fullWidth ? 'block' : '')};
  width: ${({ fullWidth }: ThemedProps<Props>) => (fullWidth ? '100%' : '')};
`;
