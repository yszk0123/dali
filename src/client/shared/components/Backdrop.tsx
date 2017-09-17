import { styled, ThemedProps } from '../styles';

interface Props {
  zIndex?: number;
}

const Backdrop = styled.div`
  position: fixed;
  z-index: ${({ zIndex }: ThemedProps<Props>) => '' + zIndex};
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0;
`;

export default Backdrop;
