import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "@/screen/LoginScreen";
import DashboardScreen from "@/screen/DashboardScreen";
import ForgotPasswordScreen from "@/screen/ForgotPasswordScreen";
import BottomNavigation from "./BottonNavigtion";
import DashboardNavigation from "./Dashboardnavigation";
import TaskDetail from "@/components/Screens/Detail/TaskDetail";
import AccountManager from "@/components/Screens/AccountManager/AccountManager";
import AddProject from "@/components/Screens/Detail/AddProject";
import AddAccount from "@/components/Screens/Detail/AddAccount";
import UpdateUser from "@/components/Screens/AccountManager/UpdateUser";
import VerifyPasswordScreen from "@/components/Screens/AccountManager/VerifyPasswordScreen";
import ProjectDetail from "@/components/Screens/Detail/ProjectDetail";
import AddTask from "@/components/Screens/Detail/AddTask";
import UpdateProject from "@/components/Screens/Detail/UpdateProject";

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
                <Stack.Screen name="DashboardScreen" component={BottomNavigation} options={{gestureEnabled: false, }}/>
                <Stack.Screen name="TaskDetail" component={TaskDetail}/>
                <Stack.Screen name="AccountManager" component={AccountManager} />
                <Stack.Screen name="AddProject" component={AddProject} />
                <Stack.Screen name="AddAccount" component={AddAccount} />
                <Stack.Screen name="UpdateUser" component={UpdateUser} />
                <Stack.Screen name="VerifyPasswordScreen" component={VerifyPasswordScreen} />
                <Stack.Screen name="ProjectDetail" component={ProjectDetail} />
                <Stack.Screen name="AddTask" component={AddTask} />
                <Stack.Screen name="UpdateProject" component={UpdateProject} />
                <Stack.Screen
                    name="ForgotPasswordScreen"
                    component={ForgotPasswordScreen}
                    options={{ title: 'Quên mật khẩu' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
