import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Avatar, Button, XStack } from "tamagui";

import { supabase } from "../utils/supabase";

type AvatarUploadProps = {
  url: string | null;
  onUpload: (filePath: string) => void;
};
export default function AvatarUpload({ onUpload, url }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      });

      console.log(result);
      if (!result.canceled && result.assets.length >= 1) {
        const filePath = result.assets[0].uri.split("/").at(-1);
        const photo = {
          uri: result.assets[0].uri,
          type: result.assets[0].type,
          name: filePath
        };

        const formData = new FormData();
        // @ts-ignore comment
        formData.append("file", photo);

        // const fileExt = result.assets[0].fileName.split(".").pop();
        console.log({ filePath });

        console.log("Sending to supabase...");
        const { error } = await supabase.storage
          .from("avatars")
          .upload(filePath, formData);

        if (error) {
          console.log("Line 71", error);
          throw error;
        }

        onUpload(filePath);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  return (
    <XStack
      space
      alignItems="center"
    >
      <Avatar
        circular
        size="$6"
      >
        <Avatar.Image src={avatarUrl} />
        <Avatar.Fallback bc="$blue10Light" />
      </Avatar>
      <Button
        onPress={uploadAvatar}
        disabled={uploading}
      >
        {uploading ? "Uploading" : "Upload"}
      </Button>
    </XStack>
  );
}
