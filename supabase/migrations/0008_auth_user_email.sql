-- Lets Admin look up a Supabase Auth user's email by UUID without a
-- service-role key. auth.users isn't exposed via PostgREST to anon/
-- authenticated roles, so this SECURITY DEFINER function reads it
-- directly (same pattern as is_admin()/current_agent_id()), gated to
-- admins only so it can't be used to enumerate arbitrary users' emails.
create or replace function auth_user_email(target_user_id uuid)
returns text
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  if not is_admin() then
    return null;
  end if;
  return (select email from auth.users where id = target_user_id);
end;
$$;

grant execute on function auth_user_email(uuid) to authenticated;
