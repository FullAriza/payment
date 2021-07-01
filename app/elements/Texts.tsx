import React from "react";
import { TextStyle, View } from "react-native";
import { Text } from "react-native-paper";
import Colors from "../config/Colors";
import AppStyles from "../styles/AppStyles";

export const H1 = ({ text, style }: { text: string; style?: TextStyle }) => (
  <Text style={[AppStyles.h1, style]}>{text}</Text>
);
export const H2 = ({ text, style }: { text: string; style?: TextStyle }) => (
  <Text style={[AppStyles.h2, style]}>{text}</Text>
);
export const H3 = ({ text, style }: { text: string; style?: TextStyle }) => (
  <Text style={[AppStyles.h3, style]}>{text}</Text>
);

export const Alert = ({ label }: { label: string }) => (
  <View style={AppStyles.error}>
    <Text style={[AppStyles.b, { color: Colors.White }]}>{label}</Text>
  </View>
);
