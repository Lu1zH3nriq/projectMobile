import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import appFirebase from '../credenciaisFirebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const db = getFirestore(appFirebase)

export default function Login(props) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const [loading, setLoading] = useState(false);

    const loginUsuario = async () => {
        setLoading(true);
        try {
            const queryUser = await getDocs(collection(db, 'Usuários'));
            let user = {};
            queryUser.forEach((doc) => {
                const data = doc.data();
                if (data.email === email && data.pass === senha) {
                    user = { ...data, id: doc.id };
                }
            });
            if (Object.keys(user).length !== 0) { 
                props.navigation.navigate('Home', { user: user });
            } else {
                Alert.alert('Erro', 'Usuário não encontrado! Email ou senha inválidos.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer login.');
        }
        finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {

        if (email.trim() === '' || senha.trim() === '') {
            Alert.alert('Atenção!', 'Por favor, preencha todos os campos.');
        } else {
            loginUsuario();
        }
    };

    // const loginUsuario = async () => {
    //     const user = {
    //         nome: 'Sandro',
    //         email: 'prof@mail.com',
    //         pass: '***',
    //         tipo: 2,
    //     };
    //     setLoading(true);

    //     setTimeout(() => {
    //         setLoading(false);

            
    //         props.navigation.navigate('Home', { user: user });
    //     }, 4000);
    // };

    // const handleLogin = () => {
    //     loginUsuario();
    // };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder='email'
                placeholderTextColor="#00427C"
                value={email}
                onChangeText={value => setEmail(value)}
                style={styles.input}
                required
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    secureTextEntry={!mostrarSenha}
                    placeholder='senha'
                    placeholderTextColor="#00427C"
                    value={senha}
                    onChangeText={value => setSenha(value)}
                    style={styles.input}
                    required
                />
            </View>
            <TouchableOpacity style={{ marginTop: 15 }} onPress={() => setMostrarSenha(!mostrarSenha)}>
                <Text style={styles.mostrarSenhaText}>{mostrarSenha ? 'Ocultar' : 'Mostrar'} Senha</Text>
            </TouchableOpacity>
            <View style={styles.containerButton}>
                <TouchableOpacity style={styles.Button} onPress={handleLogin}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (<Text style={styles.TextoButton}>Entrar</Text>)}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        paddingTop: 200,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#00427C',
        marginTop: 5,
        width: '80%',
        height: 50,
    },
    containerButton: {
        width: '100%',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    Button: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00427C',
        height: 35,
        borderColor: '#0D2136',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 20,
    },
    TextoButton: {
        fontSize: 18,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mostrarSenhaText: {
        color: '#00427C',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
})
