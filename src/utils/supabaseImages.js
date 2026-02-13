import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export const getImageUrl = (path) => {
  if (!path) return null;
  return supabase.storage.from("alojamientos").getPublicUrl(path).data
    .publicUrl;
};
