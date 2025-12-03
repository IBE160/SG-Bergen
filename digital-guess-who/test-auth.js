const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
  const email = `test_${Date.now()}@example.com`;
  const password = 'password123';

  console.log(`Attempting to sign up with: ${email}`);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Sign Up Error:', error.message);
    return;
  }

  console.log('Sign Up Data:', data);

  if (data.user && data.user.identities && data.user.identities.length === 0) {
      console.error("User created but no identities. This usually means the user already exists.");
  } else if (data.user && !data.session) {
      console.warn("WARNING: User created but NO SESSION returned.");
      console.warn("This means 'Confirm Email' is likely ENABLED in your Supabase Dashboard.");
      console.warn("You must go to Authentication > Providers > Email and disable 'Confirm email'.");
  } else if (data.session) {
      console.log("SUCCESS! User signed up and session created. Auth is working.");
  }
}

testAuth();
