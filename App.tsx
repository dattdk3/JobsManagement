import React, { useEffect } from "react";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
import AppNavigator from "@/navigation/Appnavigator";
import { ThemeContext, ThemeProvider } from "./components/Theme/Theme";
//import { requestUserPermission, listenForNotifications } from "./services/notificationService";
import { Provider } from "react-redux";
import { store } from "./redux/store";
// import { registerRootComponent } from 'expo';
// import App from './App';

const Index = () => {
  // useEffect(() => {
  //   requestUserPermission();
  //   listenForNotifications();
  // }, []);

  // registerRootComponent(App);

  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({ theme }) => (
          <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={eva[theme]}>
            <Provider store={store}>
              <AppNavigator />
              </Provider>
            </ApplicationProvider>
          </>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
};

export default Index;
