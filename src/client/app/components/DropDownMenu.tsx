import * as React from 'react';
import styled from '../styles/StyledComponents';
import Backdrop from './Backdrop';

const Content = styled.div`
  position: absolute;
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
  onRequestClose?(): void;
}

interface State {}

export default class DropDownMenu extends React.Component<Props, State> {
  private handleClick = () => {
    const { isOpen, onRequestClose } = this.props;

    if (isOpen && onRequestClose) {
      onRequestClose();
    }
  };

  render() {
    const { toggleElement, isOpen, children } = this.props;

    return (
      <div>
        {toggleElement}
        {isOpen && <Backdrop onClick={this.handleClick} />}
        {isOpen && <Content>{children}</Content>}
      </div>
    );
  }
}
