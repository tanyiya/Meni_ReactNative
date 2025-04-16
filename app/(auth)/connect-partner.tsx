import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Heart, Copy, Check } from "lucide-react-native";
import { colors } from "@/constants/colors";
import useAuthStore from "@/store/useAuthStore";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";

export default function ConnectPartnerScreen() {
  const [partnerCode, setPartnerCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const { user, connectPartner } = useAuthStore();
  const router = useRouter();

  const myConnectionCode = user?.connectionCode || "LOADING...";

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(myConnectionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = async () => {
    if (!partnerCode.trim()) {
      setError("Please enter your partner's connection code");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await connectPartner(partnerCode.trim());
      Alert.alert(
        "Connected Successfully!",
        "You are now connected with your partner.",
        [{ text: "Continue", onPress: () => router.replace("/(tabs)") }]
      );
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.iconContainer}>
            <Heart size={40} color={colors.primary} />
          </View>

          <Text style={styles.title}>Connect with Your Partner</Text>
          <Text style={styles.subtitle}>
            Share your connection code with your partner or enter theirs to connect.
          </Text>

          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Your Connection Code</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{myConnectionCode}</Text>
              <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
                {copied ? (
                  <Check size={20} color={colors.success} />
                ) : (
                  <Copy size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.codeHint}>Share this code with your partner</Text>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Text style={styles.inputLabel}>Partner's Connection Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter code"
            value={partnerCode}
            onChangeText={(text) => setPartnerCode(text.toUpperCase())}
            autoCapitalize="characters"
            returnKeyType="done"
          />

          <TouchableOpacity
            style={styles.connectButton}
            onPress={handleConnect}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.connectButtonText}>Connect</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip for Now</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 22,
  },
  codeContainer: {
    marginBottom: 32,
  },
  codeLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  codeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 8,
  },
  codeText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    letterSpacing: 1,
  },
  copyButton: {
    padding: 8,
  },
  codeHint: {
    fontSize: 14,
    color: colors.textLight,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    color: colors.textLight,
    fontWeight: "500",
  },
  errorText: {
    color: colors.danger,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  connectButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  connectButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  skipButton: {
    alignItems: "center",
    padding: 8,
  },
  skipButtonText: {
    color: colors.textLight,
    fontSize: 16,
  },
});
