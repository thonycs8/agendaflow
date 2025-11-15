-- Fix security issues: Add search_path to functions

-- Update the update_professional_rating function
CREATE OR REPLACE FUNCTION public.update_professional_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  target_professional_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_professional_id := OLD.professional_id;
  ELSE
    target_professional_id := NEW.professional_id;
  END IF;

  IF target_professional_id IS NOT NULL THEN
    UPDATE public.professionals
    SET 
      rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM public.reviews
        WHERE professional_id = target_professional_id
      ),
      total_reviews = (
        SELECT COUNT(*)
        FROM public.reviews
        WHERE professional_id = target_professional_id
      )
    WHERE id = target_professional_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Update the update_business_rating function
CREATE OR REPLACE FUNCTION public.update_business_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  target_business_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_business_id := OLD.business_id;
  ELSE
    target_business_id := NEW.business_id;
  END IF;

  IF target_business_id IS NOT NULL THEN
    UPDATE public.businesses
    SET 
      rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM public.reviews
        WHERE business_id = target_business_id
      ),
      total_reviews = (
        SELECT COUNT(*)
        FROM public.reviews
        WHERE business_id = target_business_id
      )
    WHERE id = target_business_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Update the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;