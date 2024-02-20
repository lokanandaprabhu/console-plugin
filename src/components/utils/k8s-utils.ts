import {
  K8sModel,
  MatchExpression,
  MatchLabels,
  Selector,
} from '@openshift-console/dynamic-plugin-sdk';
import { Options } from '@openshift-console/dynamic-plugin-sdk/lib/api/internal-types';
import _ from 'lodash';

export const k8sBasePath = `${
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).SERVER_FLAGS.basePath
}api/kubernetes`;

const getK8sAPIPath = ({ apiGroup = 'core', apiVersion }: K8sModel): string => {
  const isLegacy = apiGroup === 'core' && apiVersion === 'v1';
  let p = isLegacy ? '/api/' : '/apis/';

  if (!isLegacy && apiGroup) {
    p += `${apiGroup}/`;
  }

  p += apiVersion;
  return p;
};

export const groupVersionFor = (apiVersion: string) => ({
  group: apiVersion.split('/').length === 2 ? apiVersion.split('/')[0] : 'core',
  version:
    apiVersion.split('/').length === 2 ? apiVersion.split('/')[1] : apiVersion,
});

export const getK8sResourcePath = (
  model: K8sModel,
  options: Options,
): string => {
  let u = getK8sAPIPath(model);

  if (options.ns) {
    u += `/namespaces/${options.ns}`;
  }
  u += `/${model.plural}`;
  if (options.name) {
    // Some resources like Users can have special characters in the name.
    u += `/${encodeURIComponent(options.name)}`;
  }
  if (options.path) {
    u += `/${options.path}`;
  }
  if (!_.isEmpty(options.queryParams)) {
    const q = _.map(options.queryParams, (v, k) => {
      return `${k}=${v}`;
    });
    u += `?${q.join('&')}`;
  }

  return u;
};

export const resourceURL = (model: K8sModel, options: Options): string =>
  `${k8sBasePath}${getK8sResourcePath(model, options)}`;

const toArray = (value) => (Array.isArray(value) ? value : [value]);

export const requirementToString = (requirement: MatchExpression): string => {
  if (requirement.operator === 'Equals') {
    return `${requirement.key}=${requirement.values[0]}`;
  }

  if (requirement.operator === 'NotEquals') {
    return `${requirement.key}!=${requirement.values[0]}`;
  }

  if (requirement.operator === 'Exists') {
    return requirement.key;
  }

  if (requirement.operator === 'DoesNotExist') {
    return `!${requirement.key}`;
  }

  if (requirement.operator === 'In') {
    return `${requirement.key} in (${toArray(requirement.values).join(',')})`;
  }

  if (requirement.operator === 'NotIn') {
    return `${requirement.key} notin (${toArray(requirement.values).join(
      ',',
    )})`;
  }

  if (requirement.operator === 'GreaterThan') {
    return `${requirement.key} > ${requirement.values[0]}`;
  }

  if (requirement.operator === 'LessThan') {
    return `${requirement.key} < ${requirement.values[0]}`;
  }

  return '';
};

export const createEquals = (key: string, value: string): MatchExpression => ({
  key,
  operator: 'Equals',
  values: [value],
});

const isOldFormat = (selector: Selector | MatchLabels) =>
  !selector.matchLabels && !selector.matchExpressions;

export const toRequirements = (selector: Selector = {}): MatchExpression[] => {
  const requirements = [];
  const matchLabels = isOldFormat(selector) ? selector : selector.matchLabels;
  const { matchExpressions } = selector;

  Object.keys(matchLabels || {})
    .sort()
    .forEach((k) => {
      requirements.push(createEquals(k, matchLabels[k]));
    });

  (matchExpressions || []).forEach((me) => {
    requirements.push(me);
  });

  return requirements;
};

export const selectorToString = (selector: Selector): string => {
  const requirements = toRequirements(selector);
  return requirements.map(requirementToString).join(',');
};
