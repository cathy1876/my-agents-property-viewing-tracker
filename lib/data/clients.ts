import { createClient } from "@/lib/supabase/server";
import type { Client } from "@/lib/types";

export interface ClientInput {
  name: string;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
}

export async function getClients(): Promise<Client[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getClient(id: string): Promise<Client | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function createClientRecord(input: ClientInput): Promise<Client> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .insert({
      name: input.name,
      phone: input.phone || null,
      email: input.email || null,
      notes: input.notes || null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateClientRecord(
  id: string,
  input: ClientInput,
): Promise<Client> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .update({
      name: input.name,
      phone: input.phone || null,
      email: input.email || null,
      notes: input.notes || null,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteClientRecord(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
