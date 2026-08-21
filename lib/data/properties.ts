import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/types";

export interface PropertyInput {
  address: string;
  listing_ref?: string | null;
  notes?: string | null;
}

export async function getProperties(): Promise<Property[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("address", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getProperty(id: string): Promise<Property | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function createPropertyRecord(
  input: PropertyInput,
): Promise<Property> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .insert({
      address: input.address,
      listing_ref: input.listing_ref || null,
      notes: input.notes || null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updatePropertyRecord(
  id: string,
  input: PropertyInput,
): Promise<Property> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .update({
      address: input.address,
      listing_ref: input.listing_ref || null,
      notes: input.notes || null,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deletePropertyRecord(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
