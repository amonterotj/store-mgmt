"use client";

import { useState, useEffect } from "react";
import { useLazyGetStoreByIdQuery } from "@/store/api/storeApi";
import { useAppDispatch } from "@/store/hooks";
import { setStore } from "@/store/storeSlice";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RegisterCard from "@/components/RegisterCard";

export default function Home() {
  const [storeNumber, setStoreNumber] = useState("");
  const dispatch = useAppDispatch();
  
  const [
    getStore, 
    { data: storeData, error, isLoading, isFetching }
  ] = useLazyGetStoreByIdQuery();

  const handleLoadStore = () => {
    if (storeNumber) {
      getStore(storeNumber);
    }
  };

  // Update store in Redux when API data arrives
  useEffect(() => {
    if (storeData) {
      dispatch(setStore(storeData));
    }
  }, [storeData, dispatch]);

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
                disabled={isLoading || isFetching}
                onClick={handleLoadStore}
              >
                {isLoading || isFetching ? 'Loading...' : 'Load Store'}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-500 mt-2">
                {error instanceof Error ? error.message : 'Failed to load store'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Register grid - Only visible when store is loaded */}
        {storeData && (
          <div className="w-full mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Registers - Store {storeData.id}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {storeData.registers.map((register) => (
                <RegisterCard 
                  key={register.id} 
                  register={register}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
