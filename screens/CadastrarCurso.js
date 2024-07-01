import { cloneElement, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button, Alert, TouchableOpacity } from 'react-native';

//importar firebase
import appFirebase from '../credenciaisFirebase';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore'


const db = getFirestore(appFirebase)

export default function CadastrarCurso(props) {

    const { curso } = props?.route?.params || {};

    const initialState = {
        nome:'',
        duracaoPeriodos: '',
        disciplinas:[],
    }
    const editState = {
        id: curso?.id || '',
        nome: curso?.nome || '',
        duracaoPeriodos: curso?.duracaoPeriodos || '',
        disciplinas: curso?.disciplinas || [],
    }

    const [state, setState] = useState(curso ? editState : initialState);

    const handleChangetext = (value, nome) => {
        setState({ ...state, [nome]: value })
    }

    const salvarCurso = async () => {
        try {
            const novoCurso = {
                nome: state.nome,
                duracaoPeriodos: state.duracaoPeriodos,
                disciplinas: state.disciplinas.split(',').map(disciplina => disciplina.trim())
            };
            await addDoc(collection(db, 'Cursos'), novoCurso);
            Alert.alert('Sucesso', 'Curso cadastrado com sucesso!');
            setState(initialState);

            const cursosRef = collection(db, 'Cursos');
            const cursosSnapshot = await getDocs(cursosRef);
            const cursos = cursosSnapshot.docs.map(doc => doc.data());
            props.navigation.navigate('Cursos', { newListCursos: cursos });
        } catch (error) {
            console.error('Erro ao cadastrar curso:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao cadastrar o curso. Por favor, tente novamente.');
        }
    }

    const editarCurso = async () => {
        try {
            const cursoEditado = {
                id: curso.id,
                nome: state.nome,
                duracaoPeriodos: state.duracaoPeriodos,
                disciplinas: state.disciplinas
            };
            await setDoc(doc(db, 'Cursos', curso.id), cursoEditado);
            Alert.alert('Sucesso', 'Curso editado com sucesso!');
            setState(initialState);

            const cursosRef = collection(db, 'Cursos');
            const cursosSnapshot = await getDocs(cursosRef);
            const cursos = cursosSnapshot.docs.map(doc => doc.data());
            props.navigation.navigate('Cursos', { newListCursos: cursos });
        } catch (error) {
            console.error('Erro ao editar curso:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao editar o curso. Por favor, tente novamente.');
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.titulo}>{curso ? 'Editar Curso' : 'Cadastrar Curso'}</Text>

            <View style={styles.inputGroup}>
                <TextInput placeholder='nome' placeholderTextColor={'#00427C'} onChangeText={(value) => handleChangetext(value, 'nome')}
                    value={state.nome} style={{textColor: '#00427C'}}
                    color={'#00427C'}
                    />
            </View>

            <View style={styles.inputGroup}>
                <TextInput placeholder='Quant. Períodos' placeholderTextColor={'#00427C'} onChangeText={(value) => handleChangetext(value, 'duracaoPeriodos')}
                    value={state.duracaoPeriodos} 
                    color={'#00427C'}/>
            </View> 

            <View style={styles.inputGroup}>
                {curso ? (
                    curso?.disciplinas.map((disciplina, idx) => (
                        <TextInput
                            key={idx}
                            placeholder='Disciplinas (separadas por vírgulas)'
                            placeholderTextColor={'#00427C'}
                            onChangeText={(value) => handleChangetext(value, 'disciplinas')}
                            value={disciplina}
                            color={'#00427C'}
                        />

                    ))
                ) : (
                    <TextInput
                        placeholder='Disciplinas (separadas por vírgulas)'
                        placeholderTextColor={'#00427C'}
                        onChangeText={(value) => handleChangetext(value, 'disciplinas')}
                        value={state.disciplinas}
                        color={'#00427C'}
                    />
                )}


            </View>

            <View style={styles.containerButton}>
                <TouchableOpacity style={styles.Button} onPress={()=>{
                    if(curso){
                        editarCurso();
                    }
                    else{
                        salvarCurso();
                    }
                }}>
                    <Text style={styles.TextoButton}>{curso? 'Salvar' : 'Cadastrar'}</Text>
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