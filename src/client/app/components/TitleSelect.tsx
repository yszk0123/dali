import * as React from 'react';
import * as Select from 'react-select';
import { Option } from 'react-select';
import toNonEmptyArray from '../utils/toNonEmptyArray';
import TitlePlaceholder from './TitlePlaceholder';

interface SelectItem {
  id: string;
  title: string;
}

interface Props {
  resetAfterSelect?: boolean;
  defaultLabel?: string;
  fullWidth?: boolean;
  selectedId: string | null;
  items: (SelectItem | null)[];
  onCreate?(title: string): void;
  onChange(id: string | null): void;
  onBlur?(): void;
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
      title: this.getTitleById(props.selectedId) || '',
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

  private handleChange = (option: Option<string> | null) => {
    if (!option || !option.value || !option.label) {
      return;
    }

    const {
      selectedId: originalSelectedId,
      resetAfterSelect,
      onCreate,
      onChange,
    } = this.props;

    if (onCreate && !this.getTitleById(option.value)) {
      onCreate(option.value);
    } else if (option.value !== originalSelectedId) {
      onChange(option.value);
    }

    if (resetAfterSelect) {
      this.reset();
    } else {
      this.setState({
        selectedId: option.value,
        title: option.label,
        isEditing: false,
      });
    }
  };

  private handleBlur = () => {
    const { onBlur } = this.props;

    this.reset();
    onBlur && onBlur();
  };

  private getTitleById(selectedId: string | null): string | null {
    const { items } = this.props;
    const item = items.find(item => !!item && item.id === selectedId);
    return item ? item.title : null;
  }

  private reset() {
    const { selectedId } = this.props;

    this.setState({
      selectedId,
      title: this.getTitleById(selectedId) || '',
      isEditing: false,
    });
  }

  render() {
    const { defaultLabel, fullWidth, items } = this.props;
    const { title, selectedId, isEditing } = this.state;

    if (!isEditing) {
      return (
        <TitlePlaceholder
          fullWidth={fullWidth}
          defaultLabel={defaultLabel}
          label={title}
          onClick={this.handlePlaceholderClick}
        />
      );
    }

    const options = toNonEmptyArray(items).map(item => ({
      value: item.id,
      label: item.title,
    }));

    return (
      <Select.Creatable
        autoBlur
        autofocus
        openOnFocus
        value={selectedId || ''}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        options={options}
      />
    );
  }
}
