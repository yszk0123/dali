/* @flow */
import React from 'react';
import styled from 'styled-components';
import { createFragmentContainer, graphql } from 'react-relay';
import RemoveProjectMutation from '../../graphql/mutations/RemoveProjectMutation';
import UpdateProjectMutation from '../../graphql/mutations/UpdateProjectMutation';
import Icon from './Icon';
import TitleInput from './TitleInput';

type Props = {
  project: any,
  viewer: any,
  relay: any,
};

const Wrapper = styled.div`margin: 2.5rem;`;

export class ProjectItem extends React.Component {
  props: Props;

  _handleRemoveButtonClick = (event: Event) => {
    this._remove();
  };

  _handleTitleChange = ({ title }) => {
    this._updateTitle(title);
  };

  _updateTitle(title) {
    const { relay, project } = this.props;

    UpdateProjectMutation.commit(relay.environment, { title }, project);
  }

  _remove() {
    RemoveProjectMutation.commit(
      this.props.relay.environment,
      this.props.project,
      this.props.viewer,
    );
  }

  render() {
    const { project } = this.props;

    return (
      <Wrapper>
        <TitleInput title={project.title} onChange={this._handleTitleChange} /> {' '}
        <Icon icon="trash" onClick={this._handleRemoveButtonClick} />
      </Wrapper>
    );
  }
}

export default createFragmentContainer(
  ProjectItem,
  graphql`
    fragment ProjectItem_project on Project {
      id
      title
    }

    fragment ProjectItem_viewer on User {
      id
    }
  `,
);
