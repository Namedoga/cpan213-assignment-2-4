
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Pokemon Progress App</Text>
      <Text style={styles.subtitle}>
        Use this app to fetch Pikachu data and choose your starter Pokémon.
      </Text>

      <View style={styles.buttonGroup}>
        <Button
          title="Go to Progress"
          onPress={() => navigation.navigate("Progress")}
        />
      </View>

      <View style={styles.buttonGroup}>
       <Button
          title="Choose Starter Pokémon"
          onPress={() => navigation.navigate("Starter")}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 24 },
  buttonGroup: { marginVertical: 8, width: "60%", maxWidth: 500, }, 
});
