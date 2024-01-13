import {View, Text, Button} from 'react-native';
import React from 'react';

const Main = () => {
  return (
    <View style={{flex: 1, padding: 5, backgroundColor: 'green'}}>
      <Text style={{color: 'black', textAlign: 'center'}}>Main</Text>

      <View>
        <Button style={{color: 'black'}} title="Tender" />
      </View>
    </View>
  );
};

export default Main;
