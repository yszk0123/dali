import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { Link } from 'react-router-dom';
import { GroupItem_groupFragment } from 'schema';
import { styled } from '../../shared/styles';
import { Icon, TitleInput } from '../../shared/components';
import { UpdateGroup, RemoveGroup } from '../mutations';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.6rem;
  padding: 0.4rem 1.2rem;
`;

const TitleInputWrapper = styled.span`flex-grow: 1;`;

type OwnProps = {
  group: GroupItem_groupFragment;
};

interface GroupItemProps {
  remove(): void;
  updateTitle(title: string): void;
  setGroup(groupId: string): void;
}

type Props = QueryProps & OwnProps & GroupItemProps;

export function GroupItem({ group, remove, updateTitle, setGroup }: Props) {
  return (
    <Wrapper>
      <Link to={`/groups/${group.id}/phases`}>
        <Icon icon="arrow-right" />
      </Link>
      <TitleInputWrapper>
        <TitleInput title={group.title} onChange={updateTitle} />
      </TitleInputWrapper>
      <Icon icon="trash" onClick={remove} />
    </Wrapper>
  );
}

const withData = compose(
  graphql<Response, OwnProps, Props>(RemoveGroup.mutation, {
    props: ({ mutate, ownProps: { group } }) => ({
      remove: () => mutate && mutate(RemoveGroup.build({ groupId: group.id })),
    }),
  }),
  graphql<Response, OwnProps, Props>(UpdateGroup.mutation, {
    props: ({ mutate, ownProps: { group } }) => ({
      updateTitle: (title: string) =>
        mutate &&
        mutate(UpdateGroup.build({ title, groupId: group.id }, {}, group)),
    }),
  }),
);

export default withData(GroupItem);
