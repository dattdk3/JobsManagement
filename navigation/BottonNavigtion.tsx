import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, TouchableOpacity, View, Platform, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DashboardScreen from '@/screen/DashboardScreen';
import AccountManagementScreen from '@/screen/AccountManagementScreen';
import SettingScreen from '@/screen/SettingScreen';
import TabIcon from '@/components/item/TabIcon';

const Tab = createBottomTabNavigator();

const TabArr = [
  {
    route: 'Home',
    label: 'Home',
    activeIcon: 'grid',
    inActiveIcon: 'grid-outline',
    component: DashboardScreen,
  },
  {
    route: 'AccountManagement',
    label: 'Password',
    activeIcon: 'calendar',
    inActiveIcon: 'calendar-outline',
    component: AccountManagementScreen,
  },
  {
    route: 'Setting',
    label: 'Setting',
    activeIcon: 'person',
    inActiveIcon: 'person-outline',
    component: SettingScreen,
  },
];

interface TabButtonProps {
  item: typeof TabArr[0];
  onPress: () => void;
  accessibilityState: { selected: boolean };
}

const TabButton: React.FC<TabButtonProps> = ({ item, onPress, accessibilityState }) => {
  const focused = accessibilityState.selected;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.tabButtonContainer}
    >
      <TabIcon
        focused={focused}
        iconName={focused ? item.activeIcon : item.inActiveIcon}
        color={focused ? '#3B82F6' : '#666'}
        size={item.route === 'Home' ? 30 : 24}
      />
      <Text style={styles.Text}>{item.label}</Text>
    </TouchableOpacity>
  );
};

const BottomNavigation: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarHideOnKeyboard: false,
              tabBarStyle: {
                height: 60 + insets.bottom,
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                paddingBottom: insets.bottom,
                backgroundColor: '#E6F0FA',
                borderTopEndRadius: 10,
                borderTopStartRadius: 10,
                elevation: 0,
                shadowOpacity: 0,
                borderTopWidth: 0,
              },
            }}
          >
            {TabArr.map((item, index) => (
              <Tab.Screen
                key={index}
                name={item.route}
                component={item.component}
                options={{
                  tabBarShowLabel: false,
                  tabBarButton: (props) => <TabButton {...props} item={item} />,
                }}
              />
            ))}
          </Tab.Navigator>
        </SafeAreaView>
      ) : (
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarHideOnKeyboard: false,
            tabBarStyle: {
              height: 60,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#E6F0FA',
              borderTopEndRadius: 10,
              borderTopStartRadius: 10,
              elevation: 0,
              shadowOpacity: 0,
              borderTopWidth: 0,
            },
          }}
        >
          {TabArr.map((item, index) => (
            <Tab.Screen
              key={index}
              name={item.route}
              component={item.component}
              options={{
                tabBarShowLabel: false,
                tabBarButton: (props) => <TabButton {...props} item={item} />,
              }}
            />
          ))}
        </Tab.Navigator>
      )}
    </View>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 0,
    paddingTop: 0,
  },
  safeArea: {
    flex: 1,
  },
  tabButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    color: '#000',
    paddingTop: 7,
  },
  Text: {
    flexShrink: 1,
    fontWeight: '600',
    color: '#111827',
  }
});