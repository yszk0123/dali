import * as React from 'react';
import styled from '../styles/StyledComponents';
import KeyCodes from '../constants/KeyCodes';
import TitlePlaceholder from './TitlePlaceholder';

const Input = styled.input`
  :focus {
    outline: none;
  }
  border: none;
  border-bottom: 2px solid #112ca5;
`;

interface Props {
  defaultLabel?: string;
  title: string;
  fullWidth?: boolean;
  onChange(title: string): void;
}

interface State {
  title: string;
  isEditing: boolean;
}

export default class TitleInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      title: props.title,
      isEditing: false,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.title !== this.state.title) {
      this.setState({
        title: nextProps.title || '',
      });
    }
  }

  private handlePlaceholderClick = () => {
    this.setState({
      isEditing: true,
    });
  };

  private handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title: event.target.value,
    });
  };

  private handleBlur = () => {
    this.updateTitle();
  };

  private handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  };

  private handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.keyCode) {
      case KeyCodes.ESCAPE:
        this.resetTitle();
        event.preventDefault();
        return;
      case KeyCodes.ENTER:
        this.updateTitle();
        event.preventDefault();
        return;
      default:
        return;
    }
  };

  private updateTitle() {
    const { title: originalTitle, onChange } = this.props;
    const { title } = this.state;

    if (title !== originalTitle) {
      onChange(title);
    }

    this.setState({
      isEditing: false,
    });
  }

  private resetTitle() {
    const { title: originalTitle } = this.props;

    this.setState({
      isEditing: false,
      title: originalTitle,
    });
  }

  render() {
    const { fullWidth, defaultLabel } = this.props;
    const { title, isEditing } = this.state;

    if (!isEditing) {
      return (
        <TitlePlaceholder
          defaultLabel={defaultLabel}
          label={title}
          fullWidth={fullWidth}
          onClick={this.handlePlaceholderClick}
        />
      );
    }

    const style = fullWidth ? { display: 'block', width: '100%' } : {};

    return (
      <Input
        autoFocus
        type="text"
        style={style}
        value={title}
        onKeyDown={this.handleKeyDown}
        onChange={this.handleTitleChange}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
      />
    );
  }
}
