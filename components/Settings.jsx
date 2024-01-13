import {
  View,
  Text,
  Platform,
  PermissionsAndroid,
  FlatList,
  Pressable,
  Button,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';

import BleManager from 'react-native-ble-manager';
const Settings = () => {
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        );
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        );
        BleManager.start()
          .then(() => {
            const devices = BleManager.scan([], 5, true)
              .then(() => console.log('Scan started'))
              .catch(e => console.log(e));

            if (devices) {
              console.log('Available devices', devices);
            }
          })
          .catch(e => console.log(e));
      } catch (error) {
        ToastAndroid.show(
          error === null ? 'Nothing' : ' Cool',
          ToastAndroid.LONG,
        );
      }
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        ToastAndroid.show('You can use camera', ToastAndroid.LONG);
      } else {
        ToastAndroid.show(`Access denied ${granted}`, ToastAndroid.LONG);
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [serviceID, setServiceID] = useState(
    '49535343-fe7d-4ae5-8fa9-9fafd205e455',
  );
  const [characteristicID, setCharacteristicID] = useState(
    '49535343-6daa-4d02-abf6-19569aca69fe',
  );

  const handleDeviceDiscovery = useCallback(data => {
    // Update the list of devices in the state
    setDevices(prevDevices => {
      const isNewDevice = !prevDevices.some(device => device.id === data.id);
      if (isNewDevice) {
        return [...prevDevices, data];
      }
      return prevDevices;
    });
  }, []);

  const connectToDevice = async device => {
    try {
      // Connect to the selected device
      const connected = await BleManager.connect(device.id);

      // Update the connected device state
      setConnectedDevice(device);

      console.log('Connected to device:', device);
    } catch (error) {
      console.error('Connection error', error);
    }
  };

  const printToThermalPrinter = async () => {
    if (!connectedDevice) {
      console.warn('Not connected to any device.');
      return;
    }

    console.log('Service IDS: ', connectedDevice.advertising.serviceUUIDs);
    console.log('IDS: ', serviceID, characteristicID);

    try {
      // Implement your logic to send print data to the thermal printer
      // You may use BleManager.write() or other relevant methods
      const dateNow = new Date().toLocaleString();
      console.log(dateNow);
      // For example:
      const printData = `      KAYCEE MINI STORE\n Date: ${dateNow}\n\n--------------------------------\n\n--------------------------------\n\nAnd that was a cool, We can start Developing Android POS\n\n\n`;
      await BleManager.write(
        connectedDevice.id,
        serviceID,
        characteristicID,
        stringToBytes(printData),
      );

      console.log('Print data sent to the thermal printer:', printData);
    } catch (error) {
      console.error('Print error', error);
    }
  };

  useEffect(() => {
    // Start Bluetooth scanning
    BleManager.start({showAlert: false});

    // Listen to device discovery events
    const discoverPeripheralSubscription = BleManager.addListener(
      'BleManagerDiscoverPeripheral',
      handleDeviceDiscovery,
    );

    // Start scanning
    BleManager.scan([], 5, true)
      .then(() => {
        console.log('Scanning started');
      })
      .catch(error => {
        console.error('Scan error', error);
      });

    // Clean up subscriptions and stop scanning on component unmount
    return () => {
      discoverPeripheralSubscription.remove();
      BleManager.stopScan();
    };
  }, []);

  // string to bytes
  const stringToBytes = str => {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      bytes.push(charCode & 0xff); // Low byte
      bytes.push((charCode >> 8) & 0xff); // High byte
    }
    return bytes;
  };

  return (
    <View style={{flex: 1, backgroundColor: 'grey'}}>
      <Text>Available Devices:</Text>
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Pressable onPress={() => connectToDevice(item)}>
            <Text>{item.name || 'Unknown Device'}</Text>
            <Text>{item.id}</Text>
          </Pressable>
        )}
      />
      {connectedDevice && (
        <View>
          <Text>Connected to: {connectedDevice.name || 'Unknown Device'}</Text>
          <Button
            title="Print to Thermal Printer"
            onPress={printToThermalPrinter}
          />
        </View>
      )}
    </View>
  );
};

export default Settings;
