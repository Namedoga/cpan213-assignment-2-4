import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, Image } from 'react-native';

export default function ProgressScreen() {
  const [loading, setLoading] = useState(false);
  const [pokemon, setPokemon] = useState(null);

  const fetchAPI = async () => {
    setLoading(true);
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
    const json = await response.json();
    setPokemon(json);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Button title="Fetch Pokémon" onPress={fetchAPI} />

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {pokemon && (
        <View style={styles.card}>
          <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>
          <Image
            source={{ uri: pokemon.sprites.front_default }}
            style={{ width: 120, height: 120 }}
          />
          <Text style={styles.info}>Weight: {pokemon.weight}</Text>
          <Text style={styles.info}>Height: {pokemon.height}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { marginTop: 20, alignItems: "center" },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  info: { fontSize: 16, marginTop: 5 }
});