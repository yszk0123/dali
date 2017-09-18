import { styled, ThemedProps, Color } from '../styles';

interface Props {
  color: Color;
}

const Button = styled.button`
  font-size: 1rem;
  padding: 0.6rem 1.4rem;
  border: none;
  border-radius: 3px;
  background: ${({ color, theme }: ThemedProps<Props>) =>
    theme.button[color].background};
  color: #eee;
  cursor: pointer;
`;

export default Button;
