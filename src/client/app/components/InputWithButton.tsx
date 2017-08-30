import * as React from 'react';
import KeyCodes from '../constants/KeyCodes';
import Button from './Button';

interface Props {
  onSubmit(value: { value: string; isChanged: boolean }): void;
  value?: string;
}

interface State {
  value: string;
}

export default class InputWithButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.value || '',
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.value !== this.state.value) {
      this.setState({
        value: nextProps.value || '',
      });
    }
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      value: event.target.value,
    });
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.which !== KeyCodes.ENTER) {
      return;
    }
    event.preventDefault();

    this.submit();
  };

  private handleSubmit = () => {
    this.submit();
  };

  private submit() {
    const { value: originalValue, onSubmit } = this.props;
    const { value } = this.state;

    onSubmit({ value, isChanged: value !== originalValue });
    this.setState({ value: '' });
  }

  render() {
    const { value } = this.state;

    return (
      <span>
        <input type="text" value={value} onChange={this.handleChange} />
        <Button onClick={this.handleSubmit}>Submit</Button>
      </span>
    );
  }
}
