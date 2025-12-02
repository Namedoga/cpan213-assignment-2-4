import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Modal,
} from "react-native";

export default function ProgressScreen() {
  const [loading, setLoading] = useState(false);
  const [pokemon, setPokemon] = useState(null);
  const [showModal, setShowModal] = useState(false);

  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  const runButtonAnimation = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchAPI = async () => {
    try {
      setShowModal(false);
      setLoading(true);
      runButtonAnimation();

      const response = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
      const json = await response.json();
      setPokemon(json);
    } catch (err) {
      console.log("Error fetching pokemon:", err);
    } finally {
      setLoading(false);
    }
  };

  const openConfirmModal = () => {
    setShowModal(true);
  };

 
  useEffect(() => {
    if (pokemon) {
      cardOpacity.setValue(0);
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start();
    }
  }, [pokemon, cardOpacity]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.buttonWrapper,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.customBtn}
          onPress={openConfirmModal}
          disabled={loading}
        >
          <Text style={styles.customBtnTxt}>
  {loading
    ? "Loading..."
    : pokemon
    ? ` ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} Fetched`
    : "Fetch"}
</Text>
        </TouchableOpacity>
      </Animated.View>

      {loading && (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      )}

      {pokemon && (
        <Animated.View style={[styles.card, { opacity: cardOpacity }]}>
          <Image
            source={{ uri: pokemon.sprites?.front_default }}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>
          <Text style={styles.info}>Height: {pokemon.height}</Text>
          <Text style={styles.info}>Weight: {pokemon.weight}</Text>
          <Text style={styles.info}>
            Base experience: {pokemon.base_experience}
          </Text>
        </Animated.View>
      )}
      
      <Modal
        transparent
        visible={showModal}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
        >
          <View style = {styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalText}>Fetch Pikachu?</Text>

              <View style={styles.modalbuttons}>
                <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => setShowModal(false)}
                >
                  <Text style={styles.modalBtnTxt}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={styles.modalBtn}
                onPress={fetchAPI}
                >
                  <Text style={styles.modalBtnTxt}>Yes!</Text>
                </TouchableOpacity>
                </View>
            </View>
          </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  buttonWrapper: { marginBottom: 16 },
  customBtn: {
    backgroundColor: "#ffcc00",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 3,
  },
  customBtnTxt: { fontSize: 18, fontWeight: "bold", color: "#333" },
  card: {
    marginTop: 20,
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
  },
  image: { width: 120, height: 120, marginBottom: 12 },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  info: { fontSize: 16, marginTop: 5 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",

  },

  modalBox: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    width: 280,
    alignItems: "center",
  },

  modalText: { 
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },

  modalbuttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  modalBtn: {
    padding: 10,
    flex: 1,
    alignItems: "center"
  },
  modalBtnTxt: {
    fontSize: 16 
  }
});
