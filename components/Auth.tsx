import React, { useState } from "react";
import { Alert } from "react-native";
import { Lock, Mail } from "@tamagui/lucide-icons";
import { Button, Input, useTheme, XStack, YStack } from "tamagui";

import { supabase } from "../utils/supabase";

export default function Auth() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <YStack
      padding="$2"
      alignSelf="center"
      space
    >
      <XStack
        space
        alignItems="center"
      >
        <Mail color={theme.color.get()} />
        <Input
          size="$3"
          width={200}
          placeholder="email@address.com"
          onChangeText={(text) => setEmail(text)}
          value={email}
          autoCapitalize={"none"}
        />
      </XStack>
      <XStack
        space
        alignItems="center"
      >
        <Lock color={theme.color.get()} />
        <Input
          size="$3"
          width={200}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          autoCapitalize={"none"}
        />
      </XStack>
      <XStack
        space
        alignSelf="center"
      >
        <Button
          disabled={loading}
          onPress={() => signInWithEmail()}
        >
          Sign In
        </Button>
        <Button
          disabled={loading}
          onPress={() => signUpWithEmail()}
        >
          Sign Up
        </Button>
      </XStack>
    </YStack>
  );
}
