import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhatsAppFloatingButtonProps {
  phoneNumber: string;
  message?: string;
  className?: string;
}

export const WhatsAppFloatingButton = ({
  phoneNumber,
  message = "Olá! Gostaria de mais informações.",
  className,
}: WhatsAppFloatingButtonProps) => {
  // Clean phone number (remove spaces, dashes, etc.)
  const cleanNumber = phoneNumber.replace(/\D/g, "");
  
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl",
        className
      )}
      aria-label="Contactar via WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
};
