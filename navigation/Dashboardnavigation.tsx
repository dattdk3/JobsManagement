import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import JobList from '@/components/Screens/Dashborad/jobList';
import ProjectManage from '@/components/Screens/Dashborad/ProjectManage';
import Report from '@/components/Screens/Dashborad/Report';

const DashboardNavigation: React.FC = () => {
  const [index, setIndex] = useState(0);

  // Dữ liệu mẫu để truyền vào các trang (có thể thay bằng dữ liệu thực tế của bạn)
  const jobListData = { title: 'Danh sách công việc', items: ['Công việc 1', 'Công việc 2'] };
  const projectManageData = { title: 'Quản lý dự án', projects: ['Dự án A', 'Dự án B'] };
  const reportData = { title: 'Báo cáo', stats: { completed: 5, pending: 2 } };

  // Danh sách các tab
  const tabs = [
    { key: 'jobList', title: 'Danh sách công việc' },
    { key: 'projectManage', title: 'Quản lý dự án' },
    { key: 'report', title: 'Báo cáo' },
  ];

  // Hàm render nội dung dựa trên tab được chọn
  const renderContent = () => {
    switch (index) {
      case 0:
        return <JobList data={jobListData} />;
      case 1:
        return <ProjectManage data={projectManageData} />;
      case 2:
        return <Report data={reportData} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Thanh TabBar tùy chỉnh */}
      <View style={styles.tabBar}>
        {tabs.map((tab, i) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, index === i && styles.tabFocused]}
            onPress={() => {
              setIndex(i);
            }}
          >
            <Text
              style={{
                color: index === i ? '#fff' : '#ddd',
                fontWeight: index === i ? 'bold' : 'normal',
                fontSize: 14,
                textAlign: 'center',
              }}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Nội dung của tab được chọn */}
      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
};

export default DashboardNavigation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabFocused: {
    backgroundColor: '#3B811', // Màu khi tab được chọn
    fontSize: 30,
  },
  content: {
    flex: 1, // Đảm bảo nội dung chiếm toàn bộ không gian còn lại
  },
});