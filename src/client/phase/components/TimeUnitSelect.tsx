import * as React from 'react';
import * as Select from 'react-select';
import { Option } from 'react-select';
import { times } from 'lodash';
import { DateOnly } from '../../shared/interfaces';
import { mapPositionToTimeRange, toDaliDate } from '../../shared/utils';
import { Icon } from '../../shared/components';

const MAX_TIME_UNITS = 48;

const options = [
  { value: false, label: 'Whole day' },
  ...times(MAX_TIME_UNITS, position => ({
    value: position,
    label: mapPositionToTimeRange(position),
  })),
];

interface Props {
  onSelect(date: DateOnly, position: number | null): void;
}

interface State {
  show: boolean;
}

export default class TimeUnitSelect extends React.Component<Props, State> {
  state = { show: false };

  private handleShowClick = () => {
    this.setState({ show: true });
  };

  private handleChange = (option: Option<number | false> | null) => {
    if (!option) {
      return;
    }

    const { onSelect } = this.props;
    const position =
      option.value === false || option.value == null ? null : option.value;
    onSelect(toDaliDate(new Date()), position);
    this.reset();
  };

  private handleBlur = () => {
    this.reset();
  };

  private reset() {
    this.setState({ show: false });
  }

  render() {
    const { show } = this.state;

    if (!show) {
      return <Icon icon="calendar" onClick={this.handleShowClick} />;
    }

    return (
      <Select
        autoBlur
        autofocus
        openOnFocus
        value={false}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        options={options}
      />
    );
  }
}
