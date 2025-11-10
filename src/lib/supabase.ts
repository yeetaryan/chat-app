import { supabase } from "@/integrations/supabase/client";

export { supabase };

// Helper function to get current user profile
export const getCurrentUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
};

// Helper function to update user online status
export const updateUserStatus = async (status: 'online' | 'offline') => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('profiles')
    .update({ 
      status,
      last_seen: new Date().toISOString()
    })
    .eq('id', user.id);
};
