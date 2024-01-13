import React, {useCallback, useEffect, useState} from 'react';
import {
  Button,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Settings from './components/Settings';
import Main from './tabScreen/Main';
import Products from './tabScreen/Products';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const App = () => {
  const HomeScreen = ({navigation}) => {
    return (
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen name="Main" component={Main} />
        <Tab.Screen name="Products" component={Products} />
      </Tab.Navigator>
    );
  };
  const ProfileScreen = ({navigation, route}) => {
    return (
      <Text style={{color: 'black'}}>
        This is {route.params.name}'s profile
      </Text>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({route, navigation}) => ({
            title: 'KAYCEE MINI STORE',
            headerRight: () => (
              <Pressable
                onPress={() => navigation.push('Settings', {name: 'Jane'})}>
                <Text style={{color: 'black'}}>Settings</Text>
              </Pressable>
            ),
          })}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  item: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
