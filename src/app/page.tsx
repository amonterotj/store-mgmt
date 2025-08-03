"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RegisterCard from "@/components/RegisterCard";
import { mockStores } from "@/data/mockStores";
import type { Store } from "@/data/mockStores";

export default function Home() {
  const [storeNumber, setStoreNumber] = useState("");
  const [currentStore, setCurrentStore] = useState<Store | null>(null);

  const handleLoadStore = () => {
    const store = mockStores[storeNumber];
    if (store) {
      setCurrentStore(store);
    } else {
      // You might want to add error handling here
      setCurrentStore(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-start p-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Store Number</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input 
                placeholder="Enter store number (e.g., 001)"
                className="flex-1"
                value={storeNumber}
                onChange={(e) => setStoreNumber(e.target.value)}
              />
              <Button 
                variant="default" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleLoadStore}
              >
                Load Store
              </Button>
            </div>
          </CardContent>
        </Card>

        {currentStore && (
          <div className="w-full mt-8">
            <h2 className="text-xl font-semibold mb-4">Registers - Store {currentStore.id}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentStore.registers.map((register) => (
                <RegisterCard key={register.id} register={register} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
