export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_PIPELINE_DETAIL_METRICS_TAB =
  'HIDE_STATIC_PIPELINE_PLUGIN_PIPELINE_DETAIL_METRICS_TAB';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_PIPELINERUN_DETAIL_TASKRUNS_TAB =
  'HIDE_STATIC_PIPELINE_PLUGIN_PIPELINERUN_DETAIL_TASKRUNS_TAB';
export const FLAG_PIPELINE_TEKTON_RESULT_INSTALLED =
  'PIPELINE_TEKTON_RESULT_INSTALLED';
export const ALL_NAMESPACES_KEY = '#ALL_NS#';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_PIPELINES_NAV_OPTION =
  'HIDE_STATIC_PIPELINE_PLUGIN_PIPELINE_NAV_OPTION';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_TASKS_NAV_OPTION =
  'HIDE_STATIC_PIPELINE_PLUGIN_TASKS_NAV_OPTION';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_TRIGGERS_NAV_OPTION =
  'HIDE_STATIC_PIPELINE_PLUGIN_TRIGGERS_NAV_OPTION';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_PIPELINES_LIST =
  'HIDE_STATIC_PIPELINE_PLUGIN_PIPELINES_LIST';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_PIPELINERUNS_LIST =
  'HIDE_STATIC_PIPELINE_PLUGIN_PIPELINERUNS_LIST';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_REPOSITORIES_LIST =
  'HIDE_STATIC_PIPELINE_PLUGIN_REPOSITORIES_LIST';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_TASKS_LIST =
  'HIDE_STATIC_PIPELINE_PLUGIN_TASKS_LIST';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_TASKRUNS_LIST =
  'HIDE_STATIC_PIPELINE_PLUGIN_TASKRUNS_LIST';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_CLUSTERTASKS_LIST =
  'HIDE_STATIC_PIPELINE_PLUGIN_CLUSTERTASKS_LIST';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_EVENTLISTENERS_LIST =
  'HIDE_STATIC_PIPELINE_PLUGIN_EVENTLISTENERSS_LIST';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_TRIGGERTEMPLATES_LIST =
  'HIDE_STATIC_PIPELINE_PLUGIN_TRIGGERTEMPLATES_LIST';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_TRIGGERBINDINGS_LIST =
  'HIDE_STATIC_PIPELINE_PLUGIN_TRIGGERBINDINGS_LIST';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_CLUSTERTRIGGERSBINDINGS_LIST =
  'HIDE_STATIC_PIPELINE_PLUGIN_CLUSTERTRIGGERSBINDINGS_LIST';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_CONDITIONS_LIST =
  'HIDE_STATIC_PIPELINE_PLUGIN_CONDITIONS_LIST';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_PIPELINE_DETAILS =
  'HIDE_STATIC_PIPELINE_PLUGIN_PIPELINE_DETAILS';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_PIPELINERUN_DETAILS =
  'HIDE_STATIC_PIPELINE_PLUGIN_PIPELINERUN_DETAILS';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_REPOSITORY_DETAILS =
  'HIDE_STATIC_PIPELINE_PLUGIN_REPOSITORY_DETAILS';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_TASK_DETAILS =
  'HIDE_STATIC_PIPELINE_PLUGIN_TASK_DETAILS';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_TASKRUN_DETAILS =
  'HIDE_STATIC_PIPELINE_PLUGIN_TASKRUN_DETAILS';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_CLUSTERTASK_DETAILS =
  'HIDE_STATIC_PIPELINE_PLUGIN_CLUSTERTASK_DETAILS';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_EVENTLISTENER_DETAILS =
  'HIDE_STATIC_PIPELINE_PLUGIN_EVENTLISTENERS_DETAILS';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_TRIGGERTEMPLATE_DETAILS =
  'HIDE_STATIC_PIPELINE_PLUGIN_TRIGGERTEMPLATE_DETAILS';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_TRIGGERBINDING_DETAILS =
  'HIDE_STATIC_PIPELINE_PLUGIN_TRIGGERBINDING_DETAILS';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_CLUSTERTRIGGERSBINDING_DETAILS =
  'HIDE_STATIC_PIPELINE_PLUGIN_CLUSTERTRIGGERSBINDING_DETAILS';
export const FLAG_HIDE_STATIC_PIPELINE_PLUGIN_CONDITIONS_DETAILS =
  'HIDE_STATIC_PIPELINE_PLUGIN_CONDITIONS_DETAILS';

export const LOG_SOURCE_RESTARTING = 'restarting';
export const LOG_SOURCE_RUNNING = 'running';
export const LOG_SOURCE_TERMINATED = 'terminated';
export const LOG_SOURCE_WAITING = 'waiting';

export const PIPELINE_SERVICE_ACCOUNT = 'pipeline';

export enum SecretAnnotationId {
  Git = 'git',
  Image = 'docker',
}

export enum StartedByAnnotation {
  user = 'pipeline.openshift.io/started-by',
}

export enum TektonResourceLabel {
  pipeline = 'tekton.dev/pipeline',
  pipelinerun = 'tekton.dev/pipelineRun',
  taskrun = 'tekton.dev/taskRun',
  pipelineTask = 'tekton.dev/pipelineTask',
}

export enum RepositoryFields {
  REPOSITORY = 'Repository',
  BRANCH = 'Branch',
  URL_REPO = 'RepoUrl',
  URL_ORG = 'RepoOrg',
  SHA = 'sha',
  EVENT_TYPE = 'EventType',
}

export const RepositoryLabels: Record<RepositoryFields, string> = {
  [RepositoryFields.REPOSITORY]: 'pipelinesascode.tekton.dev/repository',
  [RepositoryFields.BRANCH]: 'pipelinesascode.tekton.dev/branch',
  [RepositoryFields.URL_REPO]: 'pipelinesascode.tekton.dev/url-repository',
  [RepositoryFields.URL_ORG]: 'pipelinesascode.tekton.dev/url-org',
  [RepositoryFields.SHA]: 'pipelinesascode.tekton.dev/sha',
  [RepositoryFields.EVENT_TYPE]: 'pipelinesascode.tekton.dev/event-type',
};

export enum VolumeTypes {
  NoWorkspace = 'noWorkspace',
  EmptyDirectory = 'emptyDirectory',
  ConfigMap = 'configMap',
  Secret = 'secret',
  PVC = 'pvc',
  VolumeClaimTemplate = 'volumeClaimTemplate',
}
export const KEBAB_ACTION_DELETE_ID = 'delete';
export const KEBAB_ACTION_EDIT_ANNOTATIONS_ID = 'edit-annotations';
export const KEBAB_ACTION_EDIT_ID = 'edit';
export const KEBAB_ACTION_EDIT_LABELS_ID = 'edit-labels';
export const KEBAB_BUTTON_ID = 'kebab-button';

export const DELETED_RESOURCE_IN_K8S_ANNOTATION = 'resource.deleted.in.k8s';
export const RESOURCE_LOADED_FROM_RESULTS_ANNOTATION =
  'resource.loaded.from.tektonResults';
