import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { GroupPageQuery } from 'schema';
import * as GROUP_PAGE from '../../graphql/querySchema/GroupPage.graphql';
import * as CreateGroupMutation from '../../graphql/mutations/CreateGroupMutation';
import styled from '../styles/StyledComponents';
import Button from '../components/Button';
import GroupItem from './GroupItem';

const StyledGroupItem = styled(GroupItem)`margin: 1rem;`;

interface GroupPageProps {
  isLogin: boolean;
  createGroup(title: string): void;
}

interface OwnProps {}

type Data = Response & GroupPageQuery;

type Props = QueryProps & GroupPageQuery & GroupPageProps;

interface State {
  title: string;
}

export class GroupPage extends React.Component<
  ChildProps<Props, Response>,
  State
> {
  state = { title: '' };

  private handleAddGroupClick = (event: React.MouseEvent<HTMLElement>) => {
    const { title } = this.state;

    if (title) {
      this.props.createGroup(title);
      this.setState({
        title: '',
      });
    }
  };

  private handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title: event.target.value,
    });
  };

  private renderGroups() {
    const { groups } = this.props;

    return (
      groups &&
      groups.map(
        group => group && <StyledGroupItem key={group.id} group={group} />,
      )
    );
  }

  render() {
    const { isLogin } = this.props;
    const { title } = this.state;

    if (!isLogin) {
      return <span>Loading...</span>;
    }

    return (
      <div>
        <div>{this.renderGroups()}</div>
        <div>
          <input type="text" value={title} onChange={this.handleTitleChange} />
          <Button onClick={this.handleAddGroupClick}>Add</Button>
        </div>
      </div>
    );
  }
}

const withData = compose(
  graphql<Data, OwnProps, Props>(GROUP_PAGE, {
    options: {
      fetchPolicy: 'network-only',
    },
    props: ({ data }) => ({
      ...data,
      isLogin: data && data.currentUser,
    }),
  }),
  graphql<Data, OwnProps, Props>(CreateGroupMutation.mutation, {
    props: ({ mutate }) => ({
      createGroup: (title: string) =>
        mutate && mutate(CreateGroupMutation.buildMutationOptions({ title })),
    }),
  }),
);

export default withData(GroupPage);
