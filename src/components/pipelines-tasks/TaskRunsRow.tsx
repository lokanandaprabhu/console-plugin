import * as React from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import {
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
  Tooltip,
} from '@patternfly/react-core';
import { ArchiveIcon } from '@patternfly/react-icons';
import {
  K8sResourceCommon,
  ResourceLink,
  RowProps,
  TableData,
  Timestamp,
  useAccessReview,
  useDeleteModal,
} from '@openshift-console/dynamic-plugin-sdk';
import { getReferenceForModel } from '../pipelines-overview/utils';
import { PipelineModel, TaskRunModel } from '../../models';
import {
  DELETED_RESOURCE_IN_K8S_ANNOTATION,
  KEBAB_ACTION_DELETE_ID,
  KEBAB_BUTTON_ID,
  RESOURCE_LOADED_FROM_RESULTS_ANNOTATION,
  TektonResourceLabel,
} from '../../consts';
import { TaskRunKind } from '../../types';
import {
  getModelReferenceFromTaskKind,
  pipelineRunDuration,
} from '../utils/pipelines-utils';
import { taskRunFilterReducer } from '../utils/pipeline-filter-reducer';
import TaskRunStatus from './TaskRunStatus';
import { ResourceLinkWithIcon } from '../utils/resource-link';

import './TasksNavigationPage.scss';

const taskRunsReference = getReferenceForModel(TaskRunModel);
const pipelineReference = getReferenceForModel(PipelineModel);

type TaskRunKebabProps = {
  obj: K8sResourceCommon;
};

const TaskRunKebab: React.FC<TaskRunKebabProps> = ({ obj }) => {
  const { t } = useTranslation('plugin__pipeline-console-plugin');
  const [isOpen, setIsOpen] = React.useState(false);

  const message = (
    <p>
      {t(
        'This action will delete resource from k8s but still the resource can be fetched from Tekton Results',
      )}
    </p>
  );

  const launchDeleteModal = useDeleteModal(obj, undefined, message);
  const { name, namespace } = obj.metadata;
  const canDeleteTaskRun = useAccessReview({
    group: TaskRunModel.apiGroup,
    resource: TaskRunModel.plural,
    verb: 'delete',
    name,
    namespace,
  });

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onFocus = () => {
    const element = document.getElementById('kebab-button');
    element.focus();
  };

  const onSelect = () => {
    setIsOpen(false);
    onFocus();
  };

  const dropdownItems = [
    obj?.metadata?.annotations?.[DELETED_RESOURCE_IN_K8S_ANNOTATION] ===
    'true' ? (
      <Tooltip content={t('Resource is being fetched from Tekton Results.')}>
        <DropdownItem
          key={KEBAB_ACTION_DELETE_ID}
          component="button"
          onClick={launchDeleteModal}
          isDisabled={
            !canDeleteTaskRun[0] ||
            obj?.metadata?.annotations?.[DELETED_RESOURCE_IN_K8S_ANNOTATION] ===
              'true'
          }
          data-test-action={KEBAB_ACTION_DELETE_ID}
        >
          {t('Delete {{resourceKind}}', { resourceKind: TaskRunModel.kind })}
        </DropdownItem>
      </Tooltip>
    ) : (
      <DropdownItem
        key={KEBAB_ACTION_DELETE_ID}
        component="button"
        onClick={launchDeleteModal}
        isDisabled={
          !canDeleteTaskRun[0] ||
          obj?.metadata?.annotations?.[DELETED_RESOURCE_IN_K8S_ANNOTATION] ===
            'true'
        }
        data-test-action={KEBAB_ACTION_DELETE_ID}
      >
        {t('Delete {{resourceKind}}', { resourceKind: TaskRunModel.kind })}
      </DropdownItem>
    ),
  ];

  return (
    <Dropdown
      onSelect={onSelect}
      toggle={
        <KebabToggle
          id={KEBAB_BUTTON_ID}
          data-test={KEBAB_BUTTON_ID}
          onToggle={onToggle}
        />
      }
      isOpen={isOpen}
      isPlain
      dropdownItems={dropdownItems}
      position={DropdownPosition.right}
    />
  );
};

const TaskRunsRow: React.FC<RowProps<TaskRunKind>> = ({
  activeColumnIDs,
  obj,
}) => {
  const { t } = useTranslation('plugin__pipeline-console-plugin');
  return (
    <>
      <TableData activeColumnIDs={activeColumnIDs} id="name">
        <ResourceLinkWithIcon
          kind={taskRunsReference}
          model={TaskRunModel}
          name={obj.metadata.name}
          namespace={obj.metadata.namespace}
          data-test-id={obj.metadata.name}
          nameSuffix={
            <>
              {obj?.metadata?.annotations?.[
                DELETED_RESOURCE_IN_K8S_ANNOTATION
              ] === 'true' ||
              obj?.metadata?.annotations?.[
                RESOURCE_LOADED_FROM_RESULTS_ANNOTATION
              ] === 'true' ? (
                <Tooltip content={t('Archived in Tekton results')}>
                  <div className="task-run-list__results-indicator">
                    <ArchiveIcon />
                  </div>
                </Tooltip>
              ) : null}
            </>
          }
        />
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="namespace">
        <ResourceLink kind="Namespace" name={obj.metadata.namespace} />
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="pipeline">
        {obj.metadata.labels[TektonResourceLabel.pipeline] ? (
          <ResourceLink
            kind={pipelineReference}
            name={obj.metadata.labels[TektonResourceLabel.pipeline]}
            namespace={obj.metadata.namespace}
          />
        ) : (
          '-'
        )}
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="task">
        {obj.spec.taskRef?.name ? (
          <ResourceLink
            kind={getModelReferenceFromTaskKind(obj.spec.taskRef?.kind)}
            displayName={obj.metadata.labels[TektonResourceLabel.pipelineTask]}
            name={obj.spec.taskRef.name}
            namespace={obj.metadata.namespace}
          />
        ) : (
          '-'
        )}
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="pod">
        {obj.status?.podName ? (
          <ResourceLink
            kind="Pod"
            name={obj.status.podName}
            namespace={obj.metadata.namespace}
          />
        ) : (
          '-'
        )}
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="taskrunstatus">
        <TaskRunStatus status={taskRunFilterReducer(obj)} taskRun={obj} />
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="starttime">
        <Timestamp timestamp={obj?.status?.startTime} />
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="duration">
        {pipelineRunDuration(obj)}
      </TableData>
      <TableData
        activeColumnIDs={activeColumnIDs}
        id=""
        className="dropdown-kebab-pf pf-v5-c-table__action"
      >
        <TaskRunKebab obj={obj} />
      </TableData>
    </>
  );
};

export default TaskRunsRow;
