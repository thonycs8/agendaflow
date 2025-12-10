-- Add WhatsApp number field to businesses table
ALTER TABLE public.businesses 
ADD COLUMN whatsapp_number text;