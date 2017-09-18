import * as React from 'react';
import { graphql, compose, QueryProps } from 'react-apollo';
import { Link, RouteComponentProps } from 'react-router-dom';
import { GroupPageQuery as Query } from 'schema';
import * as QUERY from '../querySchema/GroupPage.graphql';
import { CreateGroup } from '../mutations';
import { styled } from '../../shared/styles';
import {
  Button,
  TitleInput,
  Icon,
  List,
  ListItem,
} from '../../shared/components';
import { UpdateGroup, RemoveGroup } from '../mutations';
import { ID } from '../../shared/interfaces';

const StyledList = styled(List)`
  padding: 24px;
  font-size: 1.6rem;
`;

const TitleInputWrapper = styled.span`flex-grow: 1;`;

type OwnProps = RouteComponentProps<any>;

type Data = Response & Query;

type Props = QueryProps &
  Query & {
    isLogin: boolean;
    updateTitle(title: string, groupId: ID): void;
    setGroup(groupId: ID): void;
    remove(groupId: ID): void;
  };

export function GroupPage({ isLogin, group, updateTitle, remove }: Props) {
  if (!isLogin) {
    return <span>Loading...</span>;
  }

  if (!group) {
    return null;
  }

  return (
    <StyledList fullWidth>
      <ListItem>
        <Link to={`/groups/${group.id}/tasks`}>
          <Icon icon="arrow-right" />
        </Link>
      </ListItem>
      <ListItem>
        <TitleInputWrapper>
          <TitleInput
            title={group.title}
            onChange={title => updateTitle(title, group.id)}
          />
        </TitleInputWrapper>
      </ListItem>
      <ListItem>
        <Button color="danger" onClick={() => remove(group.id)}>
          DELETE
        </Button>
      </ListItem>
    </StyledList>
  );
}

const withData = compose(
  graphql<Data, OwnProps, Props>(QUERY, {
    options: ({ match }) => ({
      variables: { groupId: match.params.groupId },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => ({
      ...data,
      isLogin: data && data.currentUser,
    }),
  }),
  graphql<Response, OwnProps, Props>(RemoveGroup.mutation, {
    props: ({ mutate }) => ({
      remove: (groupId: ID) => mutate && mutate(RemoveGroup.build({ groupId })),
    }),
  }),
  graphql<Response, OwnProps, Props>(UpdateGroup.mutation, {
    props: ({ mutate }) => ({
      updateTitle: (title: string, groupId: ID) =>
        mutate && mutate(UpdateGroup.build({ title, groupId })),
    }),
  }),
);

export default withData(GroupPage);
