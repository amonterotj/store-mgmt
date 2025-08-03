"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Printer, CreditCard, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Register, PaymentTerminal, Printer as PrinterType } from "@/data/mockStores";
import DeviceFormModal, { DeviceFormData } from "./DeviceFormModal";

interface RegisterCardProps {
  register: Register;
  onAddDevice?: (deviceData: DeviceFormData) => void;
}

const statusColors = {
  online: "text-green-500",
  offline: "text-red-500",
  maintenance: "text-yellow-500"
};

const deviceStatusColors = {
  connected: "text-green-500",
  disconnected: "text-red-500"
};

export default function RegisterCard({ register, onAddDevice }: RegisterCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'printer' | 'payment_terminal';
  }>({
    isOpen: false,
    type: 'printer'
  });

  const getDeviceSummary = () => {
    const terminals = register.paymentTerminals;
    const connectedTerminals = terminals.filter(t => t.status === 'connected').length;
    
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
    onAddDevice?.(data);
  };

  return (
    <>
      <Card 
        className={cn(
          "w-full transition-all duration-200 cursor-pointer",
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
            <div className="flex items-center gap-2">
              <span className={cn("font-medium", statusColors[register.status])}>
                {register.status.charAt(0).toUpperCase() + register.status.slice(1)}
              </span>
            </div>
            
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

            {isExpanded && (
              <div className="mt-2 space-y-6 border-t pt-4">
                {register.paymentTerminals.map(terminal => (
                  <div key={terminal.id} className="space-y-3">
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

                    {terminal.attachedPrinters.length > 0 && (
                      <div className="pl-4 space-y-2">
                        <h5 className="text-xs font-medium text-gray-500 mb-2">Attached Printers</h5>
                        {terminal.attachedPrinters.map(printer => (
                          <div key={printer.id} className="flex items-center justify-between bg-gray-50/50 p-2 rounded">
                            <div className="flex items-center gap-2">
                              <Printer className="w-3 h-3 text-gray-400" />
                              <span className="text-sm">{printer.model}</span>
                            </div>
                            <span className={cn("text-xs font-medium", deviceStatusColors[printer.status])}>
                              {printer.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
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