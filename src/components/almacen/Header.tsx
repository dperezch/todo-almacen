import { Package, Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: (darkMode: boolean) => void;
}

export function Header({ darkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <div className="relative h-48 bg-gradient-to-r from-blue-600 to-green-600 overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=800')] bg-cover bg-center opacity-30"></div>
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Package className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Gestión de Almacén
            </h1>
            <p className="text-blue-100">Organiza tus tareas y recordatorios</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
            <Sun className="h-4 w-4 text-yellow-300" />
            <Switch
              checked={darkMode}
              onCheckedChange={onToggleDarkMode}
              className="data-[state=checked]:bg-slate-700"
            />
            <Moon className="h-4 w-4 text-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
