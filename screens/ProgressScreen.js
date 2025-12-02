import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
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
  const progress = useRef(new Animated.Value(0)).current;

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

  const startProgress = () => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  };

  const fetchAPI = async () => {
    const MIN_DURATION = 1500;
    const startTime = Date.now();
    try {
      setShowModal(false);
      setLoading(true);
      runButtonAnimation();
      startProgress();

      const response = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
      const json = await response.json();
      setPokemon(json);

      const elapsed = Date.now() - startTime;
      const remaining = MIN_DURATION - elapsed;
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

    } catch (err) {
      console.log("Error fetching pokemon:", err);
    } finally {
      setLoading(false);
      progress.setValue(0);
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

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

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
              ? `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} Fetched`
              : "Fetch"}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {loading && (
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
        </View>
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Fetch Pikachu?</Text>

            <View style={styles.modalbuttons}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalBtnTxt}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalBtn} onPress={fetchAPI}>
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

  progressContainer: {
    marginTop: 20,
    width: "80%",
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ddd",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4caf50",
  },

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
    width: "100%",
  },
  modalBtn: {
    padding: 10,
    flex: 1,
    alignItems: "center",
  },
  modalBtnTxt: {
    fontSize: 16,
  },
});
