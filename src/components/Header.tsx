import { Store } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full bg-[#001e56] text-white py-4 px-6">
      <div className="flex items-center gap-2">
        <Store className="w-6 h-6" />
        <h1 className="text-xl font-semibold">Store Management</h1>
      </div>
    </header>
  );
} 