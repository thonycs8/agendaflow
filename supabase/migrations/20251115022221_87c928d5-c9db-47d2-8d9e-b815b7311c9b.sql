-- Adicionar role admin ao usuário thonycs8@icloud.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('82196a9d-00ea-4206-91a6-1dc638c6fcab', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;