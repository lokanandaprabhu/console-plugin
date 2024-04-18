import {
  WatchK8sResource,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { StartedByAnnotation, TektonResourceLabel } from '../../consts';
import { PersistentVolumeClaimModel, PipelineRunModel } from '../../models';
import { PersistentVolumeClaimKind, PipelineRunKind } from '../../types';
import { getReferenceForModel } from '../pipelines-overview/utils';
import { getLatestRun } from '../utils/pipeline-augment';

export const useLatestPipelineRun = (
  pipelineName: string,
  namespace: string,
): PipelineRunKind => {
  const pipelineRunResource: WatchK8sResource = {
    kind: getReferenceForModel(PipelineRunModel),
    namespace,
    selector: {
      matchLabels: { [TektonResourceLabel.pipeline]: pipelineName },
    },
    optional: true,
    isList: true,
  };
  const [pipelineRun, pipelineRunLoaded, pipelineRunError] =
    useK8sWatchResource<PipelineRunKind[]>(pipelineRunResource);

  const latestRun = getLatestRun(pipelineRun, 'creationTimestamp');
  return pipelineRunLoaded && !pipelineRunError ? latestRun : null;
};

export const usePipelinePVC = (
  pipelineName: string,
  namespace: string,
): [PersistentVolumeClaimKind, boolean] => {
  const pvcResource: WatchK8sResource = {
    kind: PersistentVolumeClaimModel.kind,
    namespace,
    selector: {
      matchLabels: { [TektonResourceLabel.pipeline]: pipelineName },
    },
    optional: true,
    isList: true,
  };
  const [PVC, PVCLoaded, PVCError] =
    useK8sWatchResource<PersistentVolumeClaimKind[]>(pvcResource);
  return [!PVCError && PVC.length > 0 ? PVC[0] : null, PVCLoaded];
};

export const useUserAnnotationForManualStart = () => {
  // const user = useSelector(getUser);

  // if (!user?.metadata?.name) {
  //   return {};
  // }

  return {
    [StartedByAnnotation.user]: 'kube:admin', // user.metadata.name,
  };
};
