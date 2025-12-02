import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";

const STARTERS = [
  { id: "bulbasaur", apiName: "bulbasaur" },
  { id: "charmander", apiName: "charmander" },
  { id: "squirtle", apiName: "squirtle" },
];

export default function SettingsScreen() {
  const [startersData, setStartersData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchStarters = async () => {
      try {
        setLoading(true);
        setError(null);

        const responses = await Promise.all(
          STARTERS.map((starter) =>
            fetch(`https://pokeapi.co/api/v2/pokemon/${starter.apiName}`)
          )
        );

        const jsonData = await Promise.all(responses.map((res) => res.json()));

        const dataMap = {};
        jsonData.forEach((data, index) => {
          const starterId = STARTERS[index].id;
          dataMap[starterId] = data;
        });

        setStartersData(dataMap);
      } catch (err) {
        console.log("Error loading starters:", err);
        setError("Failed to load starter Pokémon. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStarters();
  }, []);

  const selectedData = selectedId ? startersData[selectedId] : null;
  const selectedName =
    selectedData && selectedData.name
      ? selectedData.name.charAt(0).toUpperCase() + selectedData.name.slice(1)
      : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your starter Pokémon</Text>

      {loading && (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading starters...</Text>
        </View>
      )}

      {error && !loading && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {!loading && !error && (
        <>
          <View style={styles.starterRow}>
            {STARTERS.map((starter) => {
              const data = startersData[starter.id];
              const isSelected = selectedId === starter.id;

              const imageUri =
                data?.sprites?.other?.["official-artwork"]?.front_default ||
                data?.sprites?.front_default;

              const displayName = data?.name
                ? data.name.charAt(0).toUpperCase() + data.name.slice(1)
                : starter.id;

              return (
                <TouchableOpacity
                  key={starter.id}
                  style={[
                    styles.starterCard,
                    isSelected && styles.starterCardSelected,
                  ]}
                  onPress={() => setSelectedId(starter.id)}
                >
                  {imageUri && (
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.starterImage}
                      resizeMode="contain"
                    />
                  )}
                  <Text style={styles.starterName}>{displayName}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.messageContainer}>
            {selectedName ? (
              <Text style={styles.message}>
                You have picked{" "}
                <Text style={styles.highlight}>{selectedName}</Text> as your
                starter pokemon.
              </Text>
            ) : (
              <Text style={styles.message}>
                Tap one of the three starter Pokémon to pick your partner.
              </Text>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  loadingWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 16,
  },
  starterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 32,
  },
  starterCard: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    minWidth: 90,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  starterCardSelected: {
    borderColor: "#ffcc00",
    backgroundColor: "#fff8cc",
  },
  starterImage: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  starterName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  messageContainer: {
    paddingHorizontal: 12,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
  },
  highlight: {
    fontWeight: "bold",
  },
});
