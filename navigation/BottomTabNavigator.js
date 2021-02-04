import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import AppInfo from '../screens/AppInfo';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DataSyncScreen from "../screens/DataSyncScreen";

const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const INITIAL_ROUTE_NAME = 'Links';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
      <Drawer.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
          <Drawer.Screen name="Home"
                         component={HomeScreen}
                         options={{
                             title: 'Profil'
                         }}/>
          <Drawer.Screen name="Links"
                         component={LinksScreen}
                         options={{
                             title: 'Diet Plan'
                         }} />
          <Drawer.Screen name="Sync"
                         component={DataSyncScreen}
                         options={{
                             title: 'Import/Export Data'
                         }} />
          <Drawer.Screen name="Info"
                         component={AppInfo}
                         options={{
                             title: 'App Info'
                         }} />
      </Drawer.Navigator>
    // <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
    //   <BottomTab.Screen
    //     name="Home"
    //     component={HomeScreen}
    //     options={{
    //       title: 'Profile',
    //       tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-person" />,
    //     }}
    //   />
    //   <BottomTab.Screen
    //     name="Links"
    //     component={LinksScreen}
    //     options={{
    //       title: 'Diet Plan',
    //       tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-calendar" />,
    //     }}
    //   />
    // </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'Profile';
    case 'Links':
      return 'EpiCook';
    case 'Info':
      return 'Info';
    case 'Sync':
        return 'Data Sync';
  }
}
