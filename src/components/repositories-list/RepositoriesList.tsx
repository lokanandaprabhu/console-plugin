import * as React from 'react';
import {
  ListPageBody,
  ListPageFilter,
  VirtualizedTable,
  getGroupVersionKindForModel,
  useFlag,
  useK8sWatchResource,
  useListPageFilter,
} from '@openshift-console/dynamic-plugin-sdk';
import { useTaskRuns } from '@aonic-ui/pipelines';
import { PipelineRunModel, RepositoryModel } from '../../models';
import { PipelineRunKind, RepositoryKind } from '../../types';
import useRepositoriesColumns from './useRepositoriesColumns';
import RepositoriesRow from './RepositoriesRow';
import { useParams } from 'react-router-dom-v5-compat';
import { useTranslation } from 'react-i18next';
import { FLAG_PIPELINE_TEKTON_RESULT_INSTALLED } from '../../consts';
import { aonicFetchUtils } from '../utils/common-utils';

type RepositoriesListProps = {
  namespace?: string;
  hideTextFilter?: boolean;
};

const RepositoriesList: React.FC<RepositoriesListProps> = ({
  namespace,
  hideTextFilter,
}) => {
  const { t } = useTranslation('plugin__pipelines-console-plugin');
  const { ns } = useParams();
  namespace = namespace || ns;
  const isTektonResultEnabled = useFlag(FLAG_PIPELINE_TEKTON_RESULT_INSTALLED);
  const columns = useRepositoriesColumns(namespace);
  const [repositories, repositoriesLoaded, repositoriesLoadError] =
    useK8sWatchResource<RepositoryKind[]>({
      groupVersionKind: getGroupVersionKindForModel(RepositoryModel),
      isList: true,
      namespace,
      optional: true,
    });
  const [pipelineRuns, pipelineRunsLoaded] = useK8sWatchResource<
    PipelineRunKind[]
  >({
    isList: true,
    groupVersionKind: getGroupVersionKindForModel(PipelineRunModel),
    namespace,
    optional: true,
  });
  const [taskRuns, taskRunsLoaded] = useTaskRuns(
    aonicFetchUtils,
    namespace,
    undefined,
    isTektonResultEnabled,
  );
  const [staticData, filteredData, onFilterChange] =
    useListPageFilter(repositories);

  return (
    <ListPageBody>
      <ListPageFilter
        data={staticData}
        onFilterChange={onFilterChange}
        loaded={repositoriesLoaded}
        hideNameLabelFilters={hideTextFilter}
      />
      <VirtualizedTable
        EmptyMsg={() => (
          <div
            className="pf-u-text-align-center virtualized-table-empty-msg"
            id="no-templates-msg"
          >
            {t('No Repositories found')}
          </div>
        )}
        columns={columns}
        data={filteredData}
        loaded={repositoriesLoaded && pipelineRunsLoaded}
        loadError={repositoriesLoadError}
        Row={RepositoriesRow}
        rowData={{
          taskRuns,
          pipelineRuns,
          taskRunsLoaded,
        }}
        unfilteredData={staticData}
      />
    </ListPageBody>
  );
};

export default RepositoriesList;
