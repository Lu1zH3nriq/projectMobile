import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/FontAwesome5';

//importar firebase
import appFirebase from '../credenciaisFirebase';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoct } from 'firebase/firestore'

const db = getFirestore(appFirebase)

export default function Usuarios(props) {

    const userTypes = {
        0: 'Admin',
        1: 'Aluno',
        2: 'Professor',
    };


    const { user } = props?.route?.params;
    const { newListUsuarios } = props?.route?.params || [];
    const [usuarios, setUsuarios] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCursos = async () => {
            setLoading(true);
            const usuariosRef = collection(db, 'Usuários');
            const usuariosSnapshot = await getDocs(usuariosRef);
            const usuariosData = usuariosSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLoading(false);
            setUsuarios(usuariosData);
        };
        fetchCursos();
    }, [newListUsuarios]);

    const deleteUsuario = async (usuario) => {
        try {
            await deleteDoc(doc(db, 'Usuários', usuario.id));
            const usuarioRef = collection(db, 'Usuários');
            const usuarioSnapshot = await getDocs(usuarioRef);
            const usuariosData = usuarioSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsuarios(usuariosData);
            Alert.alert('Sucesso', 'Usuario excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir Usuario:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao excluir o usuario. Por favor, tente novamente.');
        }
    }

    return (
        <>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => { props.navigation.navigate('Cadastrar Usuarios') }}>
                    <Text style={styles.buttonText}>Cadastrar Usuário</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                {usuarios.map((usuario, index) => (
                    <View key={usuario.id || index} style={styles.cursoContainer}>
                        <View style={styles.cursoRow}>
                            <Text style={styles.cursoTitle}>{usuario.nome}</Text>
                            <View style={styles.iconContainer}>
                                <TouchableOpacity onPress={() => { props.navigation.navigate('Cadastrar Usuarios', { user: usuario }) }}>
                                    <Ionicons name="edit" size={20} color="white" style={{ paddingRight: 12 }} /></TouchableOpacity>
                                <TouchableOpacity onPress={() => { deleteUsuario(usuario) }}>
                                    <Ionicons name="trash-alt" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.cursoDescription}>Nome: {usuario.nome}</Text>
                            <Text style={styles.cursoDescription}>Email: {usuario.email}</Text>
                            <Text style={styles.cursoDescription}>Tipo: {userTypes[usuario?.tipo]}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    cursoContainer: {
        padding: 10,
        marginTop: 10,
        backgroundColor: '#00427C',
        borderColor: '#0D2136',
        borderRadius: 10,
        width: '98%',
    },
    cursoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cursoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'left',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    cursoDescription: {
        fontSize: 16,
        marginTop: 5,
        color: 'white',
    },
    disciplina: {
        fontSize: 12,
        marginTop: 5,
        color: 'white',
    },
    buttonContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#00427C',
        width: "40%",
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderColor: '#0D2136',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});