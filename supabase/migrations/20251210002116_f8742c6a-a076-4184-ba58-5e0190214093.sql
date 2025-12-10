-- Create calendar integrations table
CREATE TABLE public.calendar_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'google',
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- Add google_event_id to appointments for sync tracking
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS google_event_id TEXT;

-- Enable RLS
ALTER TABLE public.calendar_integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own calendar integrations"
ON public.calendar_integrations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calendar integrations"
ON public.calendar_integrations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar integrations"
ON public.calendar_integrations
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar integrations"
ON public.calendar_integrations
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_calendar_integrations_updated_at
BEFORE UPDATE ON public.calendar_integrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for appointments
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;