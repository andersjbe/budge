import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import { Button, H1, YStack } from "tamagui";

import Auth from "../components/Auth";
import { MyStack } from "../components/MyStack";
import { supabase } from "../utils/supabase";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      router.replace(`/account/${session?.user?.id}`);
    }
  }, [session]);

  return (
    <MyStack>
      <YStack
        space="$4"
        maxWidth={600}
      >
        <H1 textAlign="center">Welcome to Tamagui.</H1>
      </YStack>

      <Auth />

      <YStack>
        <Button
          onPress={() =>
            router.replace(`/account/b816158b-bbaa-4cd7-981e-47116d4e6038`)
          }
        >
          TEST
        </Button>
      </YStack>
    </MyStack>
  );
}
