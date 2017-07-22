/* @flow */
import React from 'react';
import TitlePlaceholder from './TitlePlaceholder';

type Props = {
  onChange: (value: { title: string }) => mixed,
  title: string,
};

export default class TitleInput extends React.Component {
  props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      title: props.title || '',
      isEditing: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.title !== this.state.title) {
      this.setState({
        title: nextProps.title,
      });
    }
  }

  _handlePlaceholderClick = () => {
    this.setState({
      isEditing: true,
    });
  };

  _handleTitleChange = event => {
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
      onChange({ title });
    }

    this.setState({
      isEditing: false,
    });
  }

  render() {
    const { title, isEditing } = this.state;

    if (!isEditing) {
      return (
        <TitlePlaceholder
          label={title}
          onClick={this._handlePlaceholderClick}
        />
      );
    }

    return (
      <input
        type="text"
        value={title}
        onChange={this._handleTitleChange}
        onBlur={this._handleBlur}
      />
    );
  }
}