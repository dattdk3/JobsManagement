import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Layout, Spinner, useTheme, Text } from '@ui-kitten/components';
import { VictoryPie, VictoryLabel } from 'victory-native';
import { useUser } from '@/hooks/useUser';
import { useTask } from '@/hooks/useTask';

const screenWidth = Dimensions.get('window').width;

const Report: React.FC = () => {
  const theme = useTheme();
  const { user: userData, loading: userLoading } = useUser();
  const { allTasks, loading: taskLoading } = useTask();

  const isLoading = userLoading || taskLoading || !userData || !allTasks;

  const backgroundCard = theme['background-basic-color-2'];
  const backgroundItem = theme['background-basic-color-3'];
  const textColor = theme['text-basic-color'];
  const hintColor = theme['text-hint-color'];

  const chartColors = [theme['color-success-500'], theme['color-warning-500']];

  if (isLoading) {
    return (
      <Layout style={[styles.container, { backgroundColor: theme['background-basic-color-1'] }]}>
        <Text category="h5" style={[styles.title, { color: textColor }]}>Báo cáo công việc</Text>
        <View style={styles.chartContainer}>
          <Spinner size="large" status="primary" />
        </View>
      </Layout>
    );
  }

  const assignedTasks = allTasks.filter(task => task.assigned_to === userData.username);
  const doneCount = assignedTasks.filter(task => task.status === true).length;
  const doingCount = assignedTasks.filter(task => task.status === false).length;

  const hasData = doneCount > 0 || doingCount > 0;

  const chartData = [
    { x: 'Hoàn thành', y: doneCount },
    { x: 'Đang thực hiện', y: doingCount },
  ];

  return (
    <Layout style={[styles.container, { backgroundColor: theme['background-basic-color-1'] }]}>
      <Text category="h5" style={[styles.title, { color: textColor }]}>Báo cáo công việc</Text>

      <View style={[styles.card, { backgroundColor: backgroundCard }]}>
        <View style={styles.chartContainer}>
          {hasData ? (
            <VictoryPie
              data={chartData}
              colorScale={chartColors}
              width={screenWidth - 48}
              height={340}
              innerRadius={0}
              labelRadius={15}
              animate={{ duration: 500, easing: 'linear' }}
              labels={({ datum }) => datum.x}
              style={{
                labels: {
                  fontSize: 14,
                  fill: textColor,
                  fontWeight: '600',
                },
                data: {
                  fillOpacity: 0.9,
                  stroke: theme['background-basic-color-1'],
                  strokeWidth: 1,
                },
                parent: {
                  backgroundColor: 'transparent',
                },
              }}
              padAngle={2}
              labelPlacement="parallel"
              startAngle={0}
              endAngle={360}
              cornerRadius={0}
              radius={150}
              labelPosition="centroid"
              labelComponent={<VictoryLabel />}
            />
          ) : (
            <Text style={[styles.noDataText, { color: hintColor }]}>Không có dữ liệu để hiển thị</Text>
          )}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: backgroundCard }]}>
        <View style={[styles.statusItem, { backgroundColor: backgroundItem }]}>
          <Text style={[styles.statusText, { color: chartColors[0] }]}>
            ✔ Hoàn thành: {doneCount}
          </Text>
        </View>
        <View style={[styles.statusItem, { backgroundColor: backgroundItem }]}>
          <Text style={[styles.statusText, { color: chartColors[1] }]}>
            🕓 Đang thực hiện: {doingCount}
          </Text>
        </View>
      </View>
    </Layout>
  );
};

export default Report;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  statusItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  noDataText: {
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 40,
    textAlign: 'center',
  },
});