import {create} from 'zustand';

import BleManager from 'react-native-ble-manager';

const usePrintStore = create(set => ({
  bluetoothManager: BleManager,

  printerName: '',
  printerServiceID: '49535343-fe7d-4ae5-8fa9-9fafd205e455',
  printerCharacteristicID: '49535343-6daa-4d02-abf6-19569aca69fe',

  setPrinterName: printer => set({printerName: printer}),
}));

export default usePrintStore;
