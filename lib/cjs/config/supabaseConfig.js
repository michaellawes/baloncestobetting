import { createClient } from "@supabase/supabase-js";
var supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
export default supabase;
//# sourceMappingURL=supabaseConfig.js.map