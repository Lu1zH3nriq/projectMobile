import { cloneElement, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

//importar firebase
import appFirebase from '../credenciaisFirebase';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore'


const db = getFirestore(appFirebase)

export default function CadastrarUsuario(props) {

    const userTypes = {
        0: 'Admin',
        1: 'Aluno',
        2: 'Professor',
    };

    const { user } = props?.route?.params || {};

    const initialState = {
        nome: '',
        email: '',
        pass: '',
        tipo: 0,
    }
    const editState = {
        id: user?.id || '',
        nome: user?.nome || '',
        email: user?.email || '',
        pass: user?.pass || '',
        tipo: user?.tipo.toString() || "0",
    }

    const [state, setState] = useState(user ? editState : initialState);

    const handleChangetext = (value, nome) => {
        setState({ ...state, [nome]: value })
    }

    const salvarUsuario = async () => {
        try {
            const novoUser = {
                nome: state.nome,
                email: state.email,
                pass: state.pass,
                tipo: parseInt(state.tipo),
            };


            console.log(novoUser);
            await addDoc(collection(db, 'Usuários'), novoUser);
            Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
            setState(initialState);

            const usuariosRef = collection(db, 'Usuários');
            const usuariosSnapshot = await getDocs(usuariosRef);
            const usuariosData = usuariosSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            props.navigation.navigate('Usuarios', { newListUsuarios: usuariosData });
        } catch (error) {
            console.error('Erro ao cadastrar usuario:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao cadastrar o usuário. Por favor, tente novamente.');
        }
    }

    const editarUsuario = async () => {
        try {
            const usuarioEditado = {
                nome: state.nome,
                email: state.email,
                pass: state.pass,
                tipo: parseInt(state.tipo),
            };
            await setDoc(doc(db, 'Usuários', user?.id), usuarioEditado);
            Alert.alert('Sucesso', 'Usuário editado com sucesso!');
            setState(initialState);

            const usuariosRef = collection(db, 'Usuários');
            const usuariosSnapshot = await getDocs(usuariosRef);
            const usuariosData = usuariosSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            props.navigation.navigate('Usuarios', { newListUsuarios: usuariosData });
        } catch (error) {
            console.error('Erro ao editar usuário:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao editar o usuário. Por favor, tente novamente.');
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.titulo}>{user ? 'Editar Usuário' : 'Cadastrar Usuário'}</Text>

            <View style={styles.inputGroup}>
                <TextInput
                    placeholder='Nome'
                    placeholderTextColor={'#00427C'}
                    onChangeText={(value) => handleChangetext(value, 'nome')}
                    value={state.nome}
                    style={{ textColor: '#00427C' }}
                    color={'#00427C'}
                />
            </View>

            <View style={styles.inputGroup}>
                <TextInput
                    placeholder='Email'
                    placeholderTextColor={'#00427C'}
                    onChangeText={(value) => handleChangetext(value, 'email')}
                    value={state.email}
                    color={'#00427C'}
                />
            </View>

            <View style={styles.inputGroup}>
                <TextInput
                    placeholder='Senha'
                    placeholderTextColor={'#00427C'}
                    onChangeText={(value) => handleChangetext(value, 'pass')}
                    value={state.pass}
                    secureTextEntry={user ? true : false}
                    style={{ textColor: '#00427C' }}
                    color={'#00427C'}
                />
            </View>

            <View style={styles.inputGroup}>
                <Picker
                    selectedValue={state.tipo.toString()}
                    onValueChange={(itemValue, itemIndex) => {
                        setState({ ...state, tipo: itemValue });
                    }}>
                    <Picker.Item label="Admin" value="0" />
                    <Picker.Item label="Aluno" value="1" />
                    <Picker.Item label="Professor" value="2" />
                </Picker>
            </View>

            <View style={styles.containerButton}>
                <TouchableOpacity
                    style={styles.Button}
                    onPress={() => {
                        if (user) {
                            editarUsuario();
                        } else {
                            salvarUsuario();
                        }
                    }}>
                    <Text style={styles.TextoButton}>{user ? 'Salvar' : 'Cadastrar'}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 35,
    },
    titulo: {
        textAlign: 'center',
        fontSize: 18,
        marginTop: 12,
        marginBottom: 20,
        color: '#00427C',
    },
    inputGroup: {
        flex: 1,
        padding: 0,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#00427C'
    },
    containerButton: {
        paddingTop: 20,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    Button: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00427C',
        borderColor: '#0D2136',
        height: 35,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
    },
    TextoButton: {
        fontSize: 18,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
});