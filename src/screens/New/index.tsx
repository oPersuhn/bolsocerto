import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { collection, doc, setDoc } from "firebase/firestore";
import { database } from '../../config/firebaseConfig'; 
import { getAuth } from "firebase/auth";

export default function New() {
  const [valorGasto, setValorGasto] = useState('');

  const enviarParaBancoDeDados = async () => {
    try {
      const auth = getAuth();
      const userId = auth.currentUser?.uid; 

      // Referência à coleção 'users' e ao documento específico do usuário
      const usersCollection = collection(database, 'users');
      const userDocRef = doc(usersCollection, userId);

      // Referência à subcoleção 'gastos' dentro do documento do usuário
      const gastosCollection = collection(userDocRef, 'gastos');

      const novoGasto = {
        valor: parseFloat(valorGasto),
        timestamp: new Date(),
      };

      await setDoc(doc(gastosCollection), novoGasto); // Define o documento com o novoGasto dentro da subcoleção 'gastos'
      console.log('Valor enviado com sucesso para o banco de dados!', userId);
    } catch (error) {
      console.error('Erro ao enviar valor para o banco de dados: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>New</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, padding: 5 }}
        keyboardType="numeric"
        placeholder="Digite o valor"
        value={valorGasto}
        onChangeText={(text) => setValorGasto(text)}
      />
      <Button title="Enviar para o Banco de Dados" onPress={enviarParaBancoDeDados} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
