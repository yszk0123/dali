import * as React from 'react';
import { styled, ThemedProps } from '../styles';
import Backdrop from './Backdrop';

interface ContentProps {
  zIndex?: number;
}

const Content = styled.div`
  position: fixed;
  z-index: ${({ zIndex }: ThemedProps<ContentProps>) => '' + zIndex};
  right: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px grey;
  background: white;
`;

interface Props {
  children: React.ReactNode[];
  toggleElement: React.ReactElement<any>;
  isOpen: boolean;
  zIndex?: number;
  onClick?(): void;
  onRequestClose?(): void;
}

interface State {}

export default class DropDownMenu extends React.Component<Props, State> {
  private handleClick = () => {
    const { isOpen, onClick, onRequestClose } = this.props;

    if (isOpen && onRequestClose) {
      onRequestClose();
    }

    onClick && onClick();
  };

  render() {
    const { toggleElement, isOpen, zIndex, children, onClick } = this.props;

    return (
      <div>
        {toggleElement}
        {isOpen && <Backdrop zIndex={zIndex} onClick={this.handleClick} />}
        {isOpen && (
          <Content zIndex={zIndex} onClick={onClick}>
            {children}
          </Content>
        )}
      </div>
    );
  }
}
