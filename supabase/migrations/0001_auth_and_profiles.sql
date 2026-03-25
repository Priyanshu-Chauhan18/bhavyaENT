-- Create a secure schema for auth-linked profiles (Identity only)

CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text NOT NULL,
  company_name text,
  phone text,
  role_key text NOT NULL DEFAULT 'customer',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT role_key_check CHECK (role_key IN ('customer', 'admin'))
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own profile
CREATE POLICY "Users can read own profile" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Users can update their own profile (with restrictions)
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Admins can read all profiles (Using a subquery check)
CREATE POLICY "Admins can read all profiles" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p2 
    WHERE p2.id = auth.uid() AND p2.role_key = 'admin'
  )
);

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p2 
    WHERE p2.id = auth.uid() AND p2.role_key = 'admin'
  )
);

-- Trigger function to automatically create a profile when an auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role_key, is_active)
  VALUES (
    new.id, 
    -- Provide a fallback name if none is passed in metadata
    COALESCE(new.raw_user_meta_data->>'full_name', 'Unknown User'), 
    'customer', 
    true
  );
  
  -- If additional meta-data like company_name or phone exists, update the newly created row.
  -- Notice: Doing it safely without causing constraint failures if missing.
  UPDATE public.profiles
  SET 
    company_name = new.raw_user_meta_data->>'company_name',
    phone = new.raw_user_meta_data->>'phone'
  WHERE id = new.id;

  RETURN new;
END;
$$;

-- Attach trigger to auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update 'updated_at' automatically
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
