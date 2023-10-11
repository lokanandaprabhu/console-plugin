import * as React from 'react';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { DomainPropType, DomainTuple } from 'victory-core';
import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartDonut,
  ChartGroup,
  ChartThemeColor,
  ChartVoronoiContainer,
} from '@patternfly/react-charts';
import { Card, CardBody, CardTitle, Flex, FlexItem } from '@patternfly/react-core';
import { chart_color_black_500 as cancelledColor } from '@patternfly/react-tokens/dist/js/chart_color_black_500';
import { chart_color_blue_100 as pendingColor } from '@patternfly/react-tokens/dist/js/chart_color_blue_100';
import { chart_color_blue_300 as runningColor } from '@patternfly/react-tokens/dist/js/chart_color_blue_300';
import { chart_color_green_400 as successColor } from '@patternfly/react-tokens/dist/js/chart_color_green_400';
import { global_danger_color_100 as failureColor } from '@patternfly/react-tokens/dist/js/global_danger_color_100';
import { formatDate, getXaxisValues, parsePrometheusDuration } from './dateTime';
import { SummaryProps } from './utils';

import './PipelinesOverview.scss';

interface PipelinesRunsStatusCardProps {
  timespan?: number;
  domain?: DomainPropType;
  summaryData: SummaryProps;
}
type DomainType = { x?: DomainTuple; y?: DomainTuple };

const PipelinesRunsStatusCard: React.FC<PipelinesRunsStatusCardProps> = ({
  timespan,
  domain,
  summaryData,
}) => {
  const { t } = useTranslation('plugin__pipeline-console-plugin');
  const startTimespan = timespan - parsePrometheusDuration('1d');
  const endDate = new Date(Date.now()).setHours(0, 0, 0, 0);
  const startDate = new Date(Date.now() - startTimespan).setHours(0, 0, 0, 0);
  const { x: domainX, y: domainY } = (domain as DomainType) || {};
  const domainValue: DomainPropType = {
    x: domainX || [startDate, endDate],
    y: domainY || undefined,
  };
  const tickValues = getXaxisValues(timespan);

  const chartData = tickValues.map((value) => {
    return { x: value, y: 100 };
  });

  if (!domainY) {
    let minY: number = _.minBy(chartData, 'y')?.y ?? 0;
    let maxY: number = _.maxBy(chartData, 'y')?.y ?? 0;
    if (minY === 0 && maxY === 0) {
      minY = -1;
      maxY = 1;
    } else if (minY > 0 && maxY > 0) {
      minY = 0;
    } else if (minY < 0 && maxY < 0) {
      maxY = 0;
    }
    domainValue.y = [minY, maxY];
  }

  const xTickFormat = (d) => formatDate(d);
  let xAxisStyle: any = {
    tickLabels: { fill: 'var(--pf-global--Color--100)' },
  };
  if (tickValues.length > 7) {
    xAxisStyle = {
      tickLabels: {
        fill: 'var(--pf-global--Color--100)',
        angle: 320,
        fontSize: 10,
        textAnchor: 'end',
        verticalAnchor: 'end',
      },
    };
  }

  const colorScale = [
    successColor.value,
    failureColor.value,
    runningColor.value,
    pendingColor.value,
    cancelledColor.value,
  ];

  const donutData = [
    {
      x: t('Succeeded'),
      y: Math.round((100 * summaryData.success) / summaryData.total),
    },
    {
      x: t('Failed'),
      y: Math.round((100 * summaryData.failed) / summaryData.total),
    },
    {
      x: t('Running'),
      y: Math.round((100 * summaryData.running) / summaryData.total),
    },
    {
      x: t('Pending'),
      y: Math.round((100 * summaryData.pending) / summaryData.total),
    },
    {
      x: t('Cancelled'),
      y: Math.round((100 * summaryData.cancelled) / summaryData.total),
    },
  ];

  const legendData = donutData.map((data) => {
    return {
      name: `${data.x}: ${data.y}%`,
    };
  });
  return (
    <>
      <Card className="pipeline-overview__pipelinerun-status-card">
        <CardTitle className="pipeline-overview__pipelinerun-status-card__title">
          <span>{t('PipelineRun status')}</span>
        </CardTitle>
        <CardBody className="pipeline-overview__pipelinerun-status-card__title">
          <Flex>
            <FlexItem>
              <div className="pipeline-overview__pipelinerun-status-card__donut-chart-div">
                <ChartDonut
                  constrainToVisibleArea={true}
                  data={donutData}
                  labels={({ datum }) => `${datum.x}: ${datum.y}%`}
                  legendData={legendData}
                  colorScale={colorScale}
                  legendOrientation="vertical"
                  legendPosition="right"
                  padding={{
                    bottom: 30,
                    right: 140, // Adjusted to accommodate legend
                    top: 20,
                  }}
                  subTitle={t('Succeeded')}
                  title={`${summaryData.success}/${summaryData.total}`}
                  width={350}
                />
              </div>
            </FlexItem>
            <FlexItem>
              <div className="pipeline-overview__pipelinerun-status-card__bar-chart-div">
                <Chart
                  containerComponent={
                    <ChartVoronoiContainer
                      labels={({ datum }) => `${t('Succeeded')}: ${datum.y}`}
                      constrainToVisibleArea
                    />
                  }
                  scale={{ x: 'time', y: 'linear' }}
                  domain={domainValue}
                  domainPadding={{ x: [30, 25] }}
                  height={200}
                  padding={{
                    top: 20,
                    bottom: 40,
                    left: 50,
                  }}
                  width={600}
                  themeColor={ChartThemeColor.blue}
                >
                  <ChartAxis tickValues={tickValues} style={xAxisStyle} tickFormat={xTickFormat} />
                  <ChartAxis dependentAxis tickFormat={(v) => `${v}%`} />
                  <ChartGroup>
                    <ChartBar data={chartData} />
                  </ChartGroup>
                </Chart>
              </div>
            </FlexItem>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};

export default PipelinesRunsStatusCard;
