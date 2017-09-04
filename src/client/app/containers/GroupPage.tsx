import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { GroupPageQuery } from 'schema';
import * as GROUP_PAGE from '../../graphql/querySchema/GroupPage.graphql';
import * as CreateGroupMutation from '../../graphql/mutations/CreateGroupMutation';
import styled from '../styles/StyledComponents';
import Button from '../components/Button';
import TitleInput from '../components/TitleInput';
import GroupItem from './GroupItem';

const Wrapper = styled.div`font-size: 1.6rem;`;

const StyledGroupItem = styled(GroupItem)`margin: 1rem;`;

const TitleInputWrapper = styled.div`margin: 1.6rem 0.8rem;`;

interface GroupPageProps {
  isLogin: boolean;
  createGroup(title: string): void;
}

interface OwnProps {}

type Data = Response & GroupPageQuery;

type Props = QueryProps & GroupPageQuery & GroupPageProps;

interface State {}

export class GroupPage extends React.Component<
  ChildProps<Props, Response>,
  State
> {
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
    const { isLogin, createGroup } = this.props;

    if (!isLogin) {
      return <span>Loading...</span>;
    }

    return (
      <Wrapper>
        <div>{this.renderGroups()}</div>
        <TitleInputWrapper>
          <TitleInput
            defaultLabel="New Group"
            title=""
            fullWidth
            onChange={createGroup}
          />
        </TitleInputWrapper>
      </Wrapper>
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
