import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Store, Register, PaymentTerminal, Printer } from '@/data/mockStores';
import { mockStores } from '@/data/mockStores';

interface StoreState {
  currentStore: Store | null;
  loading: boolean;
  error: string | null;
}

const initialState: StoreState = {
  currentStore: null,  // Changed from mockStores["001"] to null
  loading: false,
  error: null,
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    // Update entire store
    setStore: (state, action: PayloadAction<Store>) => {
      state.currentStore = action.payload;
    },
    
    // Update a specific register
    updateRegister: (state, action: PayloadAction<Register>) => {
      if (!state.currentStore) return;
      
      const index = state.currentStore.registers.findIndex(
        reg => reg.id === action.payload.id
      );
      if (index !== -1) {
        state.currentStore.registers[index] = action.payload;
      }
    },
    
    addTerminal: (state, action: PayloadAction<{ registerId: string; terminal: PaymentTerminal }>) => {
      if (!state.currentStore) return;
      
      const registerIndex = state.currentStore.registers.findIndex(
        reg => reg.id === action.payload.registerId
      );
      
      if (registerIndex !== -1) {
        // Create new references for nested arrays
        state.currentStore.registers = state.currentStore.registers.map((reg, idx) => {
          if (idx === registerIndex) {
            return {
              ...reg,
              paymentTerminals: [...reg.paymentTerminals, action.payload.terminal]
            };
          }
          return reg;
        });
      }
    },
    
    // Add a printer to a terminal
    addPrinter: (state, action: PayloadAction<{ 
      registerId: string; 
      terminalId: string; 
      printer: Printer 
    }>) => {
      if (!state.currentStore) return;
      
      const register = state.currentStore.registers.find(
        reg => reg.id === action.payload.registerId
      );
      if (register) {
        const terminal = register.paymentTerminals.find(
          term => term.id === action.payload.terminalId
        );
        if (terminal) {
          terminal.attachedPrinters.push(action.payload.printer);
        }
      }
    },
    
    // Update device status (works for both terminals and printers)
    updateDeviceStatus: (state, action: PayloadAction<{
      registerId: string;
      terminalId: string;
      printerId?: string;
      status: 'connected' | 'disconnected';
    }>) => {
      if (!state.currentStore) return;
      
      const register = state.currentStore.registers.find(
        reg => reg.id === action.payload.registerId
      );
      if (register) {
        const terminal = register.paymentTerminals.find(
          term => term.id === action.payload.terminalId
        );
        if (terminal) {
          if (action.payload.printerId) {
            // Update printer status
            const printer = terminal.attachedPrinters.find(
              p => p.id === action.payload.printerId
            );
            if (printer) {
              printer.status = action.payload.status;
            }
          } else {
            // Update terminal status
            terminal.status = action.payload.status;
          }
        }
      }
    },
  },
});

export const { 
  setStore, 
  updateRegister, 
  addTerminal, 
  addPrinter, 
  updateDeviceStatus 
} = storeSlice.actions;

export default storeSlice.reducer; 