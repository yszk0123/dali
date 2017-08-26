import * as React from 'react';
import TitlePlaceholder from './TitlePlaceholder';

interface Props {
  defaultLabel?: string;
  title: string;
  fullWidth?: boolean;
  onChange(title: string): void;
}

export default class TitleInput extends React.Component {
  props: Props;
  state: {
    title: string;
    isEditing: boolean;
  };

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

  _handlePlaceholderClick = () => {
    this.setState({
      isEditing: true,
    });
  };

  _handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title: event.target.value,
    });
  };

  _handleBlur = () => {
    this._updateTitle();
  };

  _updateTitle() {
    const { title: originalTitle, onChange } = this.props;
    const { title } = this.state;

    if (title !== originalTitle) {
      onChange(title);
    }

    this.setState({
      isEditing: false,
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
          onClick={this._handlePlaceholderClick}
        />
      );
    }

    const style = fullWidth ? { display: 'block', width: '100%' } : {};

    return (
      <input
        type="text"
        style={style}
        value={title}
        onChange={this._handleTitleChange}
        onBlur={this._handleBlur}
      />
    );
  }
}
