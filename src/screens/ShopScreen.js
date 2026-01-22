import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { UserContext } from '../context/UserContext';

const SHOP_ITEMS = [
  { id: 'herb', name: 'Herbe Magique', price: 15 },
  { id: 'insect', name: 'Insecte Rare', price: 12 },
  { id: 'resurrect', name: 'Résurrection', price: 50 }
];
const RECHARGE_AMOUNT = 100;

export const ShopScreen = () => {
  const { profile, updateTokens } = useContext(UserContext);

  /**
   * apres changement de usercontext on peut utiliser cette logique pour afficher un message si l'utilisateur n'est pas connecté
   * if (!profile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Veuillez vous connecter pour accéder à la boutique et à vos tokens.</Text>
      </View>
    );
  } */ 

  const buyItem = (item) => {
    if (profile.stats.bioTokens < item.price) {
      Alert.alert("Solde insuffisant", "Tu n'as pas assez de Bio-Tokens !");
      return;
    }
    updateTokens(-item.price);
    Alert.alert("Achat réussi", `Tu as acheté : ${item.name} !`);
  };

  const recharge = () => {
    updateTokens(RECHARGE_AMOUNT);
    Alert.alert("Bravo !", `+${RECHARGE_AMOUNT} tokens crédités gratuitement.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Boutique</Text>
      <Text style={styles.tokens}>Tes Bio-Tokens : {profile.stats.bioTokens}</Text>
      <FlatList
        data={SHOP_ITEMS}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.item} onPress={() => buyItem(item)}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.price}>{item.price} BT</Text>
          </TouchableOpacity>
        )}
        style={{marginVertical: 30}}
      />
      <TouchableOpacity style={styles.recharge} onPress={recharge}>
        <Text style={styles.rechargeText}>Recharger (+100 tokens gratuits)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, padding: 30, backgroundColor:'#fafaff' },
  title: { fontSize:28, fontWeight:'bold', marginBottom:20, color:'#333' },
  tokens: { fontSize:20, marginBottom:20, color:'#555' },
  item: { backgroundColor:'#e5ffe5', marginBottom:18, borderRadius:15, padding:18, alignItems:'center' },
  itemText: { fontSize:18, fontWeight:'bold', color:'#206020' },
  price: { fontSize:16, color:'#468' },
  recharge: { backgroundColor:'#e7f7ff', marginTop:30, padding:16, borderRadius:15, alignItems:'center' },
  rechargeText: { fontSize:18, color:'#004080' }
});