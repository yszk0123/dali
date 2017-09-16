import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { Link } from 'react-router-dom';
import { GroupItem_groupFragment } from 'schema';
import styled from '../../shared/styles/StyledComponents';
import Icon from '../../shared/components/Icon';
import TitleInput from '../../shared/components/TitleInput';
import * as RemoveGroupMutation from '../mutations/RemoveGroupMutation';
import * as UpdateGroupMutation from '../mutations/UpdateGroupMutation';

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
  graphql<Response, OwnProps, Props>(RemoveGroupMutation.mutation, {
    props: ({ mutate, ownProps: { group } }) => ({
      remove: () =>
        mutate &&
        mutate(RemoveGroupMutation.buildMutationOptions({ groupId: group.id })),
    }),
  }),
  graphql<Response, OwnProps, Props>(UpdateGroupMutation.mutation, {
    props: ({ mutate, ownProps: { group } }) => ({
      updateTitle: (title: string) =>
        mutate &&
        mutate(
          UpdateGroupMutation.buildMutationOptions(
            { title, groupId: group.id },
            {},
            group,
          ),
        ),
    }),
  }),
);

export default withData(GroupItem);
