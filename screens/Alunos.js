import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/FontAwesome5';

// Importar firebase
import appFirebase from '../credenciaisFirebase';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';

const db = getFirestore(appFirebase);

export default function Alunos(props) {

    const { user } = props.route.params;
    const { newListAlunos } = props.route.params || [];
    const [alunos, setAlunos] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlunos = async () => {
            setLoading(true);
            const alunosRef = collection(db, 'Alunos');
            const alunosSnapshot = await getDocs(alunosRef);
            const alunosData = alunosSnapshot.docs.map((doc, index) => ({
                key: `${doc.id}-${index}`,
                ...doc.data()
            }));
            setLoading(false);
            setAlunos(alunosData);
        };
        fetchAlunos();
    }, [newListAlunos]);

    function encontrarIDDoAlunoPorNome(nome) {
        const alunoEspecifico = alunos.find(aluno => aluno.nome === nome);
        if (alunoEspecifico) {
            const alunoID = alunoEspecifico.key.split('-')[0];
            return alunoID;
        } else {
            return 'Aluno não encontrado';
        }
    }
    const deleteAluno = async (aluno) => {
        try {
            const idDoAluno = encontrarIDDoAlunoPorNome(aluno.nome);
            await deleteDoc(doc(db, 'Alunos', idDoAluno));
            const alunosRef = collection(db, 'Alunos');
            const alunosSnapshot = await getDocs(alunosRef);
            const alunosData = alunosSnapshot.docs.map((doc, index) => ({
                key: `${doc.id}-${index}`,
                ...doc.data()
            }));
            setAlunos(alunosData);
            Alert.alert('Sucesso', 'Aluno excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir aluno:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao excluir o aluno. Por favor, tente novamente.');
        }
    }

    return (
        <>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => { props.navigation.navigate('Cadastrar Alunos') }}>
                    <Text style={styles.buttonText}>Cadastrar Aluno</Text>
                </TouchableOpacity>
            </View>
            {!loading ? (
                <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                    {alunos.map((aluno, index) => (
                        <View key={aluno.key || index} style={styles.cursoContainer}>
                            <View style={styles.cursoRow}>
                                <Text style={styles.cursoTitle}>{aluno.nome}</Text>
                                <View style={styles.iconContainer}>
                                    <TouchableOpacity onPress={() => { props.navigation.navigate('Cadastrar Alunos', { aluno: aluno, idAluno: encontrarIDDoAlunoPorNome(aluno.nome) }) }}>
                                        <Ionicons name="edit" size={20} color="white" style={{ paddingRight: 12 }} /></TouchableOpacity>
                                    <TouchableOpacity onPress={() => { deleteAluno(aluno) }}>
                                        <Ionicons name="trash-alt" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.cursoDescription}>Curso: {aluno.cursoGraduacao}</Text>
                                <Text style={styles.cursoDescription}>Matrícula: {aluno.matricula}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.cursoDescription}>Período atual: {aluno.periodoAtual}</Text>
                                <Text style={styles.cursoDescription}>Períodos cursados: {aluno.periodosCursado}</Text>
                            </View>
                            <Text style={styles.cursoDescription}>Último Projeto Apresentado:</Text>
                            {aluno.projetosApresentados?.map((projeto, idx) => (
                                <View key={`${aluno.id}-${idx}`}>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.disciplina}>Nome: {projeto.nomeProjeto}</Text>
                                        <Text style={styles.disciplina}>Período Apresentado: {projeto.periodoApresentado}°</Text>
                                    </View>
                                    <Text style={styles.disciplina}>Nota da Apresentação: {projeto.notaAvaliacao}</Text>
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
        flex: 1,
    },
    disciplina: {
        fontSize: 12,
        marginTop: 5,
        color: 'white',
        flex: 1,
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
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
});