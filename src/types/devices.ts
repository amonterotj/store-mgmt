import { PaymentTerminal, Printer } from "@/data/mockStores";

export interface DeviceFormData {
  id: string;
  name: string;
  type: 'payment_terminal' | 'printer';
  model: string;
  status: 'connected' | 'disconnected';
  terminalId?: string; // Optional - only required for printers
  registerId: string;
}

export interface DeviceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'printer' | 'payment_terminal';
  registerId: string;
  onSubmit: (data: DeviceFormData) => void;
} 