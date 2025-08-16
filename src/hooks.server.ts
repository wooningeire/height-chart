import type { Handle } from '@sveltejs/kit';
import { supabase } from '$/lib/server/supabase';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  };

  return resolve(event);
};


