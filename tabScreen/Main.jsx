import {View, Text, Button} from 'react-native';
import React from 'react';
import usePrintStore from '../zustand/printSettingStore';

const Main = () => {
  const {bluetoothManager, printerServiceID, printerCharacteristicID} =
    usePrintStore(state => state);
  const printerName = usePrintStore(state => state.printerName);

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

  const printToThermalPrinter = async () => {
    console.log(
      `Service ID: ${printerServiceID}, Characteristic ID:${printerCharacteristicID}`,
    );
    if (!printerName) {
      console.warn('Not connected to any device.');
      return;
    }

    try {
      // Implement your logic to send print data to the thermal printer
      // You may use BleManager.write() or other relevant methods
      const dateNow = new Date().toLocaleString();

      // For example:
      const printData = `      KAYCEE MINI STORE\n Date: ${dateNow}\n\n--------------------------------\n\nProducts goes here\n\n--------------------------------\n\nAnd that was a cool, We can start Developing Android POS\n\n\n`;
      await bluetoothManager.write(
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
  return (
    <View style={{flex: 1, padding: 1}}>
      <View>
        <Text style={{backgroundColor: 'green', padding: 2}}>
          Printer Name {printerName.name}
        </Text>
      </View>
      <View style={{backgroundColor: 'green', padding: 2}}>
        <Text style={{color: 'black', textAlign: 'center'}}>Main</Text>

        <View>
          <Button
            style={{color: 'black'}}
            title="Tender"
            onPress={printToThermalPrinter}
          />
        </View>
      </View>
    </View>
  );
};

export default Main;
