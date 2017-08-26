/* @flow */
import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { Switch, withRouter } from 'react-router-dom';
import { subDays, addDays } from 'date-fns';
import styled, { withTheme, ThemedProps } from '../styles/StyledComponents';
import { DateOnly } from '../interfaces';
import toDaliDate from '../utils/toDaliDate';
import Day from '../components/Day';
import PropsPrivateRoute from '../../shared/components/PropsPrivateRoute';
import Dummy from '../Dummy';
import TimeUnitPage from './TimeUnitPage';
// import ReportPage from './DailyReportPage';
const ReportPage = Dummy;

interface Props {
  isLogin: boolean;
}

type State = { currentDate: DateOnly };

const Clearfix = styled.span`
  :before,
  :after {
    content: " ";
    display: table;
  }

  :after {
    clear: both;
  }

  *zoom: 1;
`;

interface GoButtonProps {
  left?: boolean;
  right?: boolean;
  label: string;
  onClick: React.MouseEventHandler<HTMLElement>;
}

const GoButton = withTheme<
  ThemedProps<GoButtonProps>
>(({ theme: { goButton }, left, right, label, onClick }) => {
  let style;
  if (left) {
    style = {
      float: 'left',
      padding: goButton.space,
      marginTop: `-${goButton.space}`,
      marginLeft: `-${goButton.space}`,
      cursor: 'pointer',
    };
  }
  if (right) {
    style = {
      float: 'right',
      padding: goButton.space,
      marginTop: `-${goButton.space}`,
      marginRight: goButton.space,
      cursor: 'pointer',
    };
  }

  return (
    <span style={style} onClick={onClick}>
      {label}
    </span>
  );
});

export class DateSwitch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentDate: toDaliDate(new Date()),
    };
  }

  private handleGoToPreviousDayClick = () => {
    this.setState<'currentDate'>(({ currentDate }: State) => ({
      currentDate: toDaliDate(subDays(currentDate, 1)),
    }));
  };

  private handleGoToNextDayClick = () => {
    this.setState<'currentDate'>(({ currentDate }: State) => ({
      currentDate: toDaliDate(addDays(currentDate, 1)),
    }));
  };

  render() {
    const { isLogin } = this.props;
    const { currentDate } = this.state;

    return (
      <div>
        <div>
          <GoButton
            left
            label="&laquo; Previous"
            onClick={this.handleGoToPreviousDayClick}
          />
          <GoButton
            right
            label="Next &raquo;"
            onClick={this.handleGoToNextDayClick}
          />
        </div>
        <Clearfix />
        <h2 style={{ textAlign: 'center', width: '100%' }}>
          <Day date={currentDate} />
        </h2>
        <Switch>
          <PropsPrivateRoute
            path="/timeUnit"
            component={TimeUnitPage}
            date={currentDate}
            isLogin={isLogin}
          />
          <PropsPrivateRoute
            path="/report"
            component={ReportPage}
            date={currentDate}
            isLogin={isLogin}
          />
        </Switch>
      </div>
    );
  }
}

const withData = compose(withRouter);

export default withData(DateSwitch);
