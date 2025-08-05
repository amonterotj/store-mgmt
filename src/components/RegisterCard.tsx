"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Printer, CreditCard, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Register, PaymentTerminal, Printer as PrinterType } from "@/data/mockStores";
import DeviceFormModal from "./DeviceFormModal";
import type { DeviceFormData } from "@/types/devices";
import { useAppDispatch } from "@/store/hooks";
import { addTerminal, addPrinter } from "@/store/storeSlice";

interface RegisterCardProps {
  register: Register;
  onAddDevice?: (deviceData: DeviceFormData) => void;
}

// Maps register status to color classes for visual feedback
const statusColors = {
  online: "text-green-500",
  offline: "text-red-500",
  maintenance: "text-yellow-500"
};

// Maps device connection status to color classes
const deviceStatusColors = {
  connected: "text-green-500",
  disconnected: "text-red-500"
};

export default function RegisterCard({ register }: RegisterCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'printer' | 'payment_terminal';
  }>({
    isOpen: false,
    type: 'printer'
  });
  const dispatch = useAppDispatch();

  // Calculates a summary of connected/total devices for both terminals and their attached printers
  // This is used for the quick status display in the card header
  const getDeviceSummary = () => {
    const terminals = register.paymentTerminals;
    const connectedTerminals = terminals.filter(t => t.status === 'connected').length;
    
    // Flattens all printers from all terminals into a single array for counting
    const allPrinters = terminals.flatMap(t => t.attachedPrinters);
    const connectedPrinters = allPrinters.filter(p => p.status === 'connected').length;

    return {
      terminals: {
        total: terminals.length,
        connected: connectedTerminals
      },
      printers: {
        total: allPrinters.length,
        connected: connectedPrinters
      }
    };
  };

  const summary = getDeviceSummary();

  const handleAddDevice = (data: DeviceFormData) => {
    console.log('Adding device:', data); // Debug log
    
    if (data.type === 'payment_terminal') {
      dispatch(addTerminal({
        registerId: register.id,
        terminal: {
          id: data.id,
          model: data.model,
          status: data.status,
          attachedPrinters: []
        }
      }));
    } else {
      dispatch(addPrinter({
        registerId: register.id,
        terminalId: data.terminalId!,
        printer: {
          id: data.id,
          model: data.model,
          status: 'connected'
        }
      }));
    }
  };

  return (
    <>
      <Card 
        className={cn(
          "w-full transition-all duration-200 cursor-pointer",
          // Adds a blue ring effect when the card is expanded
          isExpanded && "ring-1 ring-blue-200"
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">{register.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="h-8 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalConfig({ isOpen: true, type: 'printer' });
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Printer
              </Button>
              <Button
                size="sm"
                className="h-8 bg-green-600 hover:bg-green-700 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalConfig({ isOpen: true, type: 'payment_terminal' });
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Terminal
              </Button>
              <div 
                className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Capitalizes first letter of status for display */}
            <div className="flex items-center gap-2">
              <span className={cn("font-medium", statusColors[register.status])}>
                {register.status.charAt(0).toUpperCase() + register.status.slice(1)}
              </span>
            </div>
            
            {/* Quick status overview showing connected/total count for devices */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <div className="text-sm">
                  <span className="font-medium">{summary.terminals.connected}/{summary.terminals.total}</span>
                  <span className="text-gray-500 ml-1">Terminals</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-gray-500" />
                <div className="text-sm">
                  <span className="font-medium">{summary.printers.connected}/{summary.printers.total}</span>
                  <span className="text-gray-500 ml-1">Printers</span>
                </div>
              </div>
            </div>

            {/* Expanded view showing detailed terminal and printer information */}
            {isExpanded && (
              <div className="mt-2 space-y-6 border-t pt-4">
                {register.paymentTerminals.map(terminal => (
                  <div key={terminal.id} className="space-y-3">
                    {/* Terminal display remains the same */}
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{terminal.model}</span>
                      </div>
                      <span className={cn("text-xs font-medium px-2 py-1 rounded-full", 
                        terminal.status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      )}>
                        {terminal.status}
                      </span>
                    </div>

                    {/* Printers section - updated with correct icon */}
                    <div className="pl-4 space-y-2">
                      <h5 className="text-xs font-medium text-gray-500 mb-2">Attached Printers</h5>
                      {terminal.attachedPrinters.map(printer => (
                        <div key={printer.id} className="flex items-center justify-between bg-gray-50/50 p-2 rounded">
                          <div className="flex items-center gap-2">
                            <Printer className="w-3 h-3 text-gray-400" /> {/* Using Printer icon */}
                            <span className="text-sm">{printer.model}</span>
                          </div>
                          <span className={cn("text-xs font-medium", deviceStatusColors[printer.status])}>
                            {printer.status}
                          </span>
                        </div>
                      ))}
                      {terminal.attachedPrinters.length === 0 && (
                        <div className="text-sm text-gray-500 italic">No printers attached</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-sm text-gray-500">
              Last active: {register.lastActive}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device form modal - handles both printer and terminal additions */}
      <DeviceFormModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        type={modalConfig.type}
        registerId={register.id}
        onSubmit={handleAddDevice}
      />
    </>
  );
}