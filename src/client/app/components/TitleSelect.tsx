import * as React from 'react';
import TitlePlaceholder from './TitlePlaceholder';

interface SelectItem {
  id: string;
  title: string;
}

interface Props {
  onChange(id: string | null): void;
  selectedId: string | null;
  items: (SelectItem | null)[];
}

interface State {
  selectedId: string | null;
  title: string;
  isEditing: boolean;
}

export default class TitleSelect extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedId: props.selectedId,
      title: this.getTitleById(props.selectedId),
      isEditing: false,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.selectedId !== this.state.selectedId) {
      this.setState({
        selectedId: nextProps.selectedId || '',
      });
    }
  }

  private handlePlaceholderClick = () => {
    this.setState({
      isEditing: true,
    });
  };

  private handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;

    this.setState({
      selectedId,
      title: this.getTitleById(selectedId),
    });
  };

  private handleBlur = () => {
    this.select();
  };

  private getTitleById(selectedId: string | null) {
    const { items } = this.props;
    const item = items.find(item => !!item && item.id === selectedId);
    return item ? item.title : '';
  }

  private select() {
    const { selectedId: originalSelectedId, onChange } = this.props;
    const { selectedId } = this.state;

    if (selectedId !== originalSelectedId) {
      onChange(selectedId);
    }

    this.setState({
      isEditing: false,
    });
  }

  render() {
    const { items } = this.props;
    const { title, selectedId, isEditing } = this.state;

    if (!isEditing) {
      return (
        <TitlePlaceholder label={title} onClick={this.handlePlaceholderClick} />
      );
    }

    return (
      <select
        value={selectedId || ''}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
      >
        <option value="" />
        {items.map(
          item =>
            item &&
            <option key={item.id} value={item.id}>
              {item.title}
            </option>,
        )}
      </select>
    );
  }
}
