import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/FontAwesome5';

//importar firebase
import appFirebase from '../credenciaisFirebase';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoct } from 'firebase/firestore'

const db = getFirestore(appFirebase)

export default function Projetos(props) {
    const { user } = props?.route?.params;
    const { newListProjetos } = props?.route?.params || [];
    const [projetos, setProjetos] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjetos = async () => {
            setLoading(true);
            const projetosRef = collection(db, 'Projetos Integradores');
            const projSnapshot = await getDocs(projetosRef);
            const projData = projSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLoading(false);
            setProjetos(projData);
        };
        fetchProjetos();
    }, [newListProjetos]);

    const deleteProjeto = async (proj) => {
        try {
            await deleteDoc(doc(db, 'Projetos Integradores', proj.id));
            const projetosRef = collection(db, 'Projetos Integradores');
            const projSnapshot = await getDocs(projetosRef);
            const projData = projSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjetos(projData);
            Alert.alert('Sucesso', 'Projeto excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir Projeto:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao excluir o projeto. Por favor, tente novamente.');
        }
    }

    return (
        <>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => { props.navigation.navigate('Cadastrar Projetos') }}>
                    <Text style={styles.buttonText}>Cadastrar P.I</Text>
                </TouchableOpacity>
            </View>
            {!loading ? (
                <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                    {projetos.map((projeto, index) => (
                        <View key={projeto.key || index} style={styles.cursoContainer}>
                            <View style={styles.cursoRow}>
                                <Text style={styles.cursoTitle}>{projeto.nomeProjeto}</Text>
                                <View style={styles.iconContainer}>
                                    <TouchableOpacity onPress={() => { props.navigation.navigate('Cadastrar Projetos', { projeto: projeto }) }}>
                                        <Ionicons name="edit" size={20} color="white" style={{ paddingRight: 12 }} /></TouchableOpacity>
                                    <TouchableOpacity onPress={() => { deleteProjeto(projeto) }}>
                                        <Ionicons name="trash-alt" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.cursoDescription}>Curso: {projeto.curso}</Text>
                                <Text style={styles.cursoDescription}>Tema: {projeto.tema}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.cursoDescription}>Período Apresentação: {projeto.periodoApresentacao}°</Text>
                                <Text style={styles.cursoDescription}>Nota: {projeto.notaAvaliacao} pontos</Text>
                            </View>
                            <Text style={styles.cursoDescription}>Grupo:</Text>
                            {projeto.grupo?.map((integrante, idx) => (
                                <View key={`${projeto.id}-${idx}`}>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.disciplina}>Nome: {integrante.nomeAluno}</Text>
                                        <Text style={styles.disciplina}>Matrícula: {integrante.matricula}°</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <ActivityIndicator size="large" color="#00427C" />
            )}
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