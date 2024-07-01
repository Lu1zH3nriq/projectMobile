import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/FontAwesome5';

//importar firebase
import appFirebase from '../credenciaisFirebase';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoct } from 'firebase/firestore'

const db = getFirestore(appFirebase)

export default function Cursos(props) {
    const { user } = props.route.params;
    const { newListCursos } = props.route.params || [];
    const [cursos, setCursos] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCursos = async () => {
            setLoading(true);
            const cursosRef = collection(db, 'Cursos');
            const cursosSnapshot = await getDocs(cursosRef);
            const cursosData = cursosSnapshot.docs.map(doc => ({
                id: doc.id, 
                ...doc.data() 
            }));
            setLoading(false);
            setCursos(cursosData);
        };
        fetchCursos();
    }, [newListCursos]);

    const deleteCurso = async (curso) => {
        try {
            await deleteDoc(doc(db, 'Cursos', curso.id));
            const cursosRef = collection(db, 'Cursos');
            const cursosSnapshot = await getDocs(cursosRef);
            const cursosData = cursosSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCursos(cursosData);
            Alert.alert('Sucesso', 'Curso excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir curso:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao excluir o curso. Por favor, tente novamente.');
        }
    }

    return (
        <>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => { props.navigation.navigate('Cadastrar Curso') }}>
                    <Text style={styles.buttonText}>Cadastrar Curso</Text>
                </TouchableOpacity>
            </View>
            {!loading ? (
                <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                {cursos.map((curso, index) => (
                    <View key={curso.id || index} style={styles.cursoContainer}>
                        <View style={styles.cursoRow}>
                            <Text style={styles.cursoTitle}>{curso.nome} </Text>
                            <View style={styles.iconContainer}>
                                <TouchableOpacity onPress={() => { props.navigation.navigate('Cadastrar Curso', { curso: curso}) }}><Ionicons name="edit" size={20} color="white" style={{ paddingRight: 12 }} /></TouchableOpacity>
                                <TouchableOpacity onPress={() => { deleteCurso(curso) }}><Ionicons name="trash-alt" size={20} color="white" /></TouchableOpacity>
                            </View>
                        </View>
                        <Text style={styles.cursoDescription}>{curso.duracaoPeriodos} períodos</Text>
                        <Text style={styles.cursoDescription}>Disciplinas:</Text>
                        {curso.disciplinas.map((disciplina, idx) => (
                            <Text key={idx} style={styles.disciplina}>{disciplina}</Text>
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