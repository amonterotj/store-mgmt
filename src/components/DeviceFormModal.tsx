"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer, CreditCard } from "lucide-react";
import type { DeviceFormModalProps, DeviceFormData } from "@/types/devices";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { addTerminal } from "@/store/storeSlice";

/**
 * Modal component for adding new devices (printers/payment terminals) to a register
 * Uses shadcn/ui components for consistent styling and accessibility
 * 
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback to close the modal
 * @param type - Determines if we're adding a printer or payment terminal
 * @param registerId - The ID of the register this device will be added to
 * @param onSubmit - Callback that handles the form submission with device data
 */
export default function DeviceFormModal({ isOpen, onClose, type, registerId, onSubmit }: DeviceFormModalProps) {
  // Remove ipAddress from initial state
  const [formData, setFormData] = useState<DeviceFormData>({
    id: crypto.randomUUID(),
    name: '',
    type: type,
    model: '',
    status: 'connected',
    registerId,
    terminalId: type === 'printer' ? '' : undefined
  });

  // Update useEffect to match new state shape
  useEffect(() => {
    setFormData({
      id: crypto.randomUUID(),
      name: '',
      type: type,
      model: '',
      status: 'connected',
      registerId,
      terminalId: type === 'printer' ? '' : undefined
    });
  }, [isOpen, type, registerId]);

  /**
   * Form submission handler
   * 1. Prevents default form submission
   * 2. Passes form data to parent component
   * 3. Closes the modal
   * 4. Resets form state for next use
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({...formData});
    onClose();
  };

  // Get available terminals for the current register
  const terminals = useAppSelector(state => 
    state.store.currentStore?.registers.find(r => r.id === registerId)?.paymentTerminals || []
  );

  console.log("TYPE: ", type);

  return (
    // Dialog component from shadcn handles accessibility and keyboard interactions
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {/* Dynamic header based on device type */}
          <div className="flex items-center gap-2">
            {type === 'printer' ? (
              <Printer className="w-5 h-5" />
            ) : (
              <CreditCard className="w-5 h-5" />
            )}
            <DialogTitle>
              Add New {type === 'printer' ? 'Printer' : 'Payment Terminal'}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Device Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={`Enter ${type} name`}
              required
            />
          </div>

          {/* Device Model Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Model</label>
            <Input
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder={`Enter ${type} model`}
              required
            />
          </div>

          {/* Status Selection
              Note: This will be used to determine initial connection state */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={formData.status}
              onValueChange={(value: 'connected' | 'disconnected') => 
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="connected">Connected</SelectItem>
                <SelectItem value="disconnected">Disconnected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Terminal Selection for Printers */}
          {type === 'printer' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Terminal</label>
              <Select
                value={formData.terminalId || ''}
                onValueChange={(value) => setFormData({ ...formData, terminalId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a terminal" />
                </SelectTrigger>
                <SelectContent>
                  {terminals.map(terminal => (
                    <SelectItem 
                      key={terminal.id} 
                      value={terminal.id}
                    >
                      {terminal.model} ({terminal.status})
                    </SelectItem>
                  ))}
                  {terminals.length === 0 && (
                    <SelectItem value="none" disabled>
                      No terminals available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Action Buttons
              Note: Cancel button type is "button" to prevent form submission */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Device</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 