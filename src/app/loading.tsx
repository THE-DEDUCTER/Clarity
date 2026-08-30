import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
