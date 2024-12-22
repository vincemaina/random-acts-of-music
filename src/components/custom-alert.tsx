import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { AlertCircle, X } from "lucide-react"

interface CustomAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

export function CustomAlert({ isOpen, onClose, title = "Warning", message }: CustomAlertProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="p-4 fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="absolute inset-0 bg-black/30"
        aria-hidden="true"
      />
      <Alert 
        variant="destructive" 
        className="
          relative
          max-w-md 
          cursor-pointer 
          backdrop-blur-md 
          bg-background/60 
          border 
          border-destructive/20 
          shadow-lg 
          shadow-destructive/10
          animate-in 
          fade-in-0 
          slide-in-from-bottom-5
          duration-200
        "
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-destructive/10 transition-colors"
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="font-semibold">{title}</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          {message}
        </AlertDescription>
      </Alert>
    </div>
  );
}
