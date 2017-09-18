import * as React from 'react';
import { graphql, compose, QueryProps } from 'react-apollo';
import { Link } from 'react-router-dom';
import { GroupListPageQuery as Query } from 'schema';
import * as QUERY from '../querySchema/GroupListPage.graphql';
import { CreateGroup } from '../mutations';
import { styled } from '../../shared/styles';
import {
  Block,
  Button,
  TitleInput,
  List,
  ListItem,
} from '../../shared/components';

const Wrapper = styled.div`font-size: 1.6rem;`;

const ItemTitle = styled.span`flex-grow: 1;`;

interface OwnProps {}

type Data = Response & Query;

type Props = QueryProps &
  Query & {
    isLogin: boolean;
    createGroup(title: string): void;
  };

export function GroupListPage({ isLogin, createGroup, groups }: Props) {
  if (!isLogin) {
    return <span>Loading...</span>;
  }

  return (
    <Wrapper>
      <Block>
        <List>
          {groups &&
            groups.map(
              group =>
                group && (
                  <ListItem key={group.id}>
                    <Link to={`/groups/${group.id}`}>
                      <ItemTitle>{group.title}</ItemTitle>
                    </Link>
                  </ListItem>
                ),
            )}
        </List>
      </Block>
      <Block>
        <TitleInput
          defaultLabel="New Group"
          title=""
          fullWidth
          onChange={createGroup}
        />
      </Block>
    </Wrapper>
  );
}

const withData = compose(
  graphql<Data, OwnProps, Props>(QUERY, {
    options: {
      fetchPolicy: 'network-only',
    },
    props: ({ data }) => ({
      ...data,
      isLogin: data && data.currentUser,
    }),
  }),
  graphql<Data, OwnProps, Props>(CreateGroup.mutation, {
    props: ({ mutate }) => ({
      createGroup: (title: string) =>
        mutate && mutate(CreateGroup.build({ title })),
    }),
  }),
);

export default withData(GroupListPage);
