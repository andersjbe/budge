import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, H1, Input, Label, Separator, XStack, YStack } from "tamagui";

import AvatarUpload from "../../components/AvatarUpload";
import { MyStack } from "../../components/MyStack";
import { supabase } from "../../utils/supabase";

export default function MyAccount() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState<{ username: string; avatarUrl: string }>({
    username: "",
    avatarUrl: ""
  });
  const [email, setEmail] = useState("");

  async function getProfile() {
    try {
      setLoading(true);
      if (!id) throw new Error("No user in the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUser({ avatarUrl: data.avatar_url, username: data.username });
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    avatarUrl,
    username
  }: {
    username: string;
    avatarUrl: string;
  }) {
    try {
      setLoading(true);

      const updates = {
        id: id,
        username,
        avatar_url: avatarUrl,
        updated_at: new Date()
      };
      console.log(updates);
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", id);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProfile();
    (async function () {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        Alert.alert(error.message);
      }
      setEmail(data?.user?.email);
    })();
  }, [id]);

  return (
    <MyStack>
      <YStack
        space
        alignItems="center"
        maxWidth={600}
      >
        <H1 textAlign="center">My Account</H1>
        <AvatarUpload
          url={user.avatarUrl}
          onUpload={(url: string) => {
            setUser({ ...user, avatarUrl: url });
            updateProfile({ avatarUrl: url, username: user.username });
          }}
        />
        <Separator />
        <XStack
          space
          mt="$3"
          alignItems="center"
        >
          <Label
            width={75}
            textAlign="right"
          >
            Email
          </Label>
          <Input
            size="$3"
            width={200}
            value={email}
            disabled
          />
        </XStack>
        <XStack
          space
          mt="$3"
        >
          <Label
            width={75}
            textAlign="right"
          >
            Username
          </Label>
          <Input
            size="$3"
            width={200}
            value={user.username}
            onChangeText={(text) => setUser({ ...user, username: text })}
          />
        </XStack>

        <Button
          alignSelf="center"
          onPress={() => updateProfile(user)}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Update"}
        </Button>
        <Separator />
        <Button
          alignSelf="center"
          onPress={() => {
            supabase.auth
              .signOut()
              .then(() => {
                router.replace("/");
              })
              .catch((err) => console.log(err));
          }}
          disabled={isLoading}
        >
          Sign Out
        </Button>
      </YStack>
    </MyStack>
  );
}
