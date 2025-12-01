import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';

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
    
      <TouchableOpacity style={styles.customBtn} onPress={fetchAPI}>
        <Text style={styles.customBtnTxt}>Fetch Pokémon</Text>
      </TouchableOpacity>

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
  customBtn: { backgroundColor: "#ffcc00", paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, elevation: 3 },
  customBtnTxt: { fontSize: 18, fontWeight: "bold", color: "#333" },
  card: { marginTop: 20, alignItems: "center" },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  info: { fontSize: 16, marginTop: 5 }
});
