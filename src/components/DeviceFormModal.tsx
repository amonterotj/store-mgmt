"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer, CreditCard } from "lucide-react";

interface DeviceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'printer' | 'payment_terminal';
  registerId: string;
  onSubmit: (data: DeviceFormData) => void;
}

export interface DeviceFormData {
  name: string;
  model: string;
  ipAddress: string;
  status: 'connected' | 'disconnected';
  registerId: string;
}

export default function DeviceFormModal({ isOpen, onClose, type, registerId, onSubmit }: DeviceFormModalProps) {
  const [formData, setFormData] = useState<DeviceFormData>({
    name: '',
    model: '',
    ipAddress: '',
    status: 'connected',
    registerId
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({ name: '', model: '', ipAddress: '', status: 'connected', registerId });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={`Enter ${type} name`}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Model</label>
            <Input
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder={`Enter ${type} model`}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">IP Address</label>
            <Input
              value={formData.ipAddress}
              onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
              placeholder="Enter IP address"
              required
            />
          </div>

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