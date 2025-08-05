export interface Printer {
  id: string;
  model: string;
  status: 'connected' | 'disconnected';
}

export interface PaymentTerminal {
  id: string;
  model: string;
  status: 'connected' | 'disconnected';
  attachedPrinters: Printer[];  // Will contain at most 1 printer
}

export interface Register {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  lastActive: string;
  paymentTerminals: PaymentTerminal[];
}

export interface Store {
  id: string;
  registers: Register[];
}

export const mockStores: Record<string, Store> = {
  "001": {
    id: "001",
    registers: [
      {
        id: "R001",
        name: "Register 1",
        status: "online",
        lastActive: "2024-03-20 10:30",
        paymentTerminals: [
          {
            id: "T001",
            model: "Verifone P400",
            status: "connected",
            attachedPrinters: [
              { id: "P001", model: "EPSON TM-T88V", status: "connected" }
            ]
          }
        ]
      },
      {
        id: "R002",
        name: "Register 2",
        status: "offline",
        lastActive: "2024-03-20 09:15",
        paymentTerminals: [
          {
            id: "T002",
            model: "Verifone P400",
            status: "disconnected",
            attachedPrinters: [
              { id: "P003", model: "EPSON TM-T88V", status: "disconnected" }
            ]
          }
        ]
      },
      {
        id: "R003",
        name: "Register 3",
        status: "online",
        lastActive: "2024-03-20 10:45",
        paymentTerminals: [
          {
            id: "T003",
            model: "Verifone P400",
            status: "connected",
            attachedPrinters: [
              { id: "P004", model: "EPSON TM-T88V", status: "connected" }
            ]
          },
          {
            id: "T004",
            model: "Ingenico Lane 3000",
            status: "connected",
            attachedPrinters: [] // No printer attached
          }
        ]
      },
      {
        id: "R004",
        name: "Register 4",
        status: "maintenance",
        lastActive: "2024-03-19 15:20",
        paymentTerminals: [
          {
            id: "T005",
            model: "Verifone P400",
            status: "disconnected",
            attachedPrinters: [
              { id: "P005", model: "EPSON TM-T88V", status: "disconnected" }
            ]
          }
        ]
      },
      {
        id: "R005",
        name: "Register 5",
        status: "online",
        lastActive: "2024-03-20 10:40",
        paymentTerminals: [
          {
            id: "T006",
            model: "Ingenico Lane 3000",
            status: "connected",
            attachedPrinters: [
              { id: "P006", model: "EPSON TM-T88V", status: "connected" }
            ]
          }
        ]
      }
    ]
  },
  "002": {
    id: "002",
    registers: [
      {
        id: "R101",
        name: "Main Register",
        status: "online",
        lastActive: "2024-03-20 10:55",
        paymentTerminals: [
          {
            id: "T101",
            model: "Ingenico Lane 3000",
            status: "connected",
            attachedPrinters: [
              { id: "P101", model: "Star TSP100", status: "connected" }
            ]
          },
          {
            id: "T102",
            model: "Clover Flex",
            status: "connected",
            attachedPrinters: []
          }
        ]
      },
      {
        id: "R102",
        name: "Service Desk",
        status: "online",
        lastActive: "2024-03-20 10:50",
        paymentTerminals: [
          {
            id: "T103",
            model: "Verifone P400",
            status: "connected",
            attachedPrinters: [
              { id: "P102", model: "EPSON TM-T88V", status: "connected" }
            ]
          }
        ]
      }
    ]
  },
  "003": {
    id: "003",
    registers: [
      {
        id: "R201",
        name: "Front Counter",
        status: "online",
        lastActive: "2024-03-20 11:00",
        paymentTerminals: [
          {
            id: "T201",
            model: "Clover Flex",
            status: "connected",
            attachedPrinters: [
              { id: "P201", model: "Star TSP100", status: "connected" }
            ]
          }
        ]
      },
      {
        id: "R202",
        name: "Drive Through",
        status: "maintenance",
        lastActive: "2024-03-19 18:30",
        paymentTerminals: [
          {
            id: "T202",
            model: "Ingenico Lane 3000",
            status: "disconnected",
            attachedPrinters: [
              { id: "P202", model: "EPSON TM-T88V", status: "disconnected" }
            ]
          }
        ]
      },
      {
        id: "R203",
        name: "Mobile Order Station",
        status: "online",
        lastActive: "2024-03-20 10:45",
        paymentTerminals: [
          {
            id: "T203",
            model: "Verifone P400",
            status: "connected",
            attachedPrinters: [
              { id: "P203", model: "Star TSP100", status: "connected" }
            ]
          }
        ]
      }
    ]
  }
}; 