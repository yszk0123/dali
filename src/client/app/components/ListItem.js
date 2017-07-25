/* @flow */
import styled from 'styled-components';

export default styled.div`
  font-size: ${({ theme }) => theme.shared.fontSize};
  margin-bottom: ${({ theme }) => theme.shared.marginBottom};
  align-content: center;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'initial')};
`;
