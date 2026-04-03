/**
 * Supabase client — browser ESM (no build step required).
 *
 * The publishable key is intentionally client-safe (read-only public data).
 * The DB password in .env is for direct DB connections only and must never
 * be shipped to the browser.
 *
 * Usage in any HTML file:
 *   <script type="module">
 *     import { supabase } from '/data/services/supabase.js';
 *   </script>
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://jeipvqyetmcqsxvliwpp.supabase.co";
const SUPABASE_KEY = "sb_publishable_xLw_44i9tOTEfWTGcDQ41Q_DLWbaC1o";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
