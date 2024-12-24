import Constants from 'expo-constants';
import { createClient } from "@supabase/supabase-js";

const { supabaseUrl, supabaseAnonKey } = Constants.expoConfig.extra;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);