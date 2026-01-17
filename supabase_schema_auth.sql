-- 1. Add user_id column to link records to Supabase Auth users
alter table public.registros 
add column user_id uuid references auth.users not null default auth.uid();

-- 2. Enable Row Level Security (Secure the fortress!)
alter table public.registros enable row level security;

-- 3. Create Policy: Users can only SEE their own records
create policy "Users can view their own records" 
on public.registros for select 
using (auth.uid() = user_id);

-- 4. Create Policy: Users can only INSERT records for themselves
create policy "Users can insert their own records" 
on public.registros for insert 
with check (auth.uid() = user_id);

-- 5. Create Policy: Users can only DELETE their own records
create policy "Users can delete their own records" 
on public.registros for delete 
using (auth.uid() = user_id);

-- Note: The previous policies (if any) should be dropped if they conflict, 
-- but since we started without specific policies, these are fresh.
