/* @flow */
import React from 'react';
import Modal from 'react-modal';

type Props = {
  isOpen: boolean,
  onRequestClose: () => mixed,
  onSubmit: (value: { title: string }) => mixed,
  title: string,
};

export default class UpdateTitleModal extends React.Component {
  props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      title: props.title || '',
    };
  }

  _handleTitleChange = event => {
    this.setState({
      title: event.target.value,
    });
  };

  _handleUpdateTitleButtonClick = () => {
    this._updateTitle();
  };

  _updateTitle() {
    const { title: originalTitle, onSubmit } = this.props;
    const { title } = this.state;

    if (!title || title === originalTitle) {
      return;
    }

    onSubmit({ title });
  }

  render() {
    const { isOpen, onRequestClose } = this.props;
    const { title } = this.state;

    return (
      <Modal
        contentLabel="modal"
        isOpen={isOpen}
        onRequestClose={onRequestClose}
      >
        <h2>Title</h2>
        <input type="text" value={title} onChange={this._handleTitleChange} />
        <button onClick={this._handleUpdateTitleButtonClick}>OK</button>
      </Modal>
    );
  }
}
