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

// import BleManager from 'react-native-ble-manager';
import usePrintStore from '../zustand/printSettingStore';
const Settings = () => {
  const printerName = usePrintStore(state => state.printerName);
  const setPrinterName = usePrintStore(state => state.setPrinterName);
  const printerServiceID = usePrintStore(state => state.printerServiceID);
  const printerCharacteristicID = usePrintStore(
    state => state.printerCharacteristicID,
  );

  const BleManager = usePrintStore(state => state.bluetoothManager);

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
  };
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);

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
      await BleManager.connect(device.id);

      // Update the connected device state
      setConnectedDevice(device);

      console.log('Connected to device:', device);
      setPrinterName(device);
    } catch (error) {
      console.error('Connection error', error);
    }
  };

  const printToThermalPrinter = async () => {
    if (!printerName) {
      console.warn('Not connected to any device.');
      return;
    }

    try {
      // Implement your logic to send print data to the thermal printer
      // You may use BleManager.write() or other relevant methods
      const dateNow = new Date().toLocaleString();

      // For example:
      const printData = `      KAYCEE MINI STORE\n Date: ${dateNow}\n\n--------------------------------\n\nThis is test print to connected Printer, It works!\n\n--------------------------------\n\nAnd that was a cool, We can start Developing Android POS\n\n\n`;
      await BleManager.write(
        printerName.id,
        printerServiceID,
        printerCharacteristicID,
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
      <Text>Active printer: {printerName.name}</Text>
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

      {printerName && (
        <View>
          <Text>Connected to: {printerName.name || 'Unknown Device'}</Text>
          <Button
            title="Print to Thermal Printer"
            onPress={() => printToThermalPrinter(printerName)}
          />
        </View>
      )}
    </View>
  );
};

export default Settings;
