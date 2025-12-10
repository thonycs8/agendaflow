-- Create storage bucket for business logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('business-logos', 'business-logos', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for business logos bucket
CREATE POLICY "Anyone can view business logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-logos');

CREATE POLICY "Business owners can upload their logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'business-logos' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Business owners can update their logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'business-logos' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Business owners can delete their logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'business-logos' 
  AND auth.uid() IS NOT NULL
);