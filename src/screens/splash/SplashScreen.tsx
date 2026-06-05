import { AppStrings } from "@/constants";
import { RootStackParamList } from "@/interface";
import { colors, horizontalScale, moderateScale, verticalScale } from "@/theme";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Splash"
>;

interface SplashScreenProps {
  navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Home");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Text style={styles.logo}>{AppStrings.app.name}</Text>
      <Text style={styles.tagline}>{AppStrings.splash.tagline}</Text>
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.spinner}
      />
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontSize: moderateScale(36),
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: horizontalScale(1),
  },
  tagline: {
    fontSize: moderateScale(16),
    color: colors.textSecondary,
    marginTop: verticalScale(8),
  },
  spinner: {
    marginTop: verticalScale(32),
  },
});
