import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button, Alert, TouchableOpacity } from 'react-native';

// Importar firebase
import appFirebase from '../credenciaisFirebase';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';

const db = getFirestore(appFirebase);

export default function CadastrarProjeto(props) {
    const { projeto } = props?.route?.params || {};
    const { user } = props?.route?.params || {};

    const initialState = {
        nomeProjeto: '',
        curso: '',
        tema: '',
        periodoApresentacao: '',
        notaAvaliacao: 0,
        grupo: [],
        disciplinas: '',
        alunosTemp: [{ nomeAluno: '', matricula: '' }],
        avaliador:
        {
            nome: user?.nome,
            email: user?.email,
        },
    };

    const editState = {
        id: projeto?.id || '',
        nomeProjeto: projeto?.nomeProjeto || '',
        curso: projeto?.curso || '',
        tema: projeto?.tema || '',
        periodoApresentacao: projeto?.periodoApresentacao || '',
        notaAvaliacao: projeto?.notaAvaliacao || '',
        grupo: projeto?.grupo || [],
        avaliador: {
            nome: projeto?.avaliador?.nome || '',
            email: projeto?.avaliador?.email || '',
        },
    };

    const [state, setState] = useState(projeto ? editState : initialState);

    const handleChangetext = (value, nome) => {
        setState({ ...state, [nome]: value });
    };

    const adicionarAluno = () => {
        setState(prevState => ({
            ...prevState,
            alunosTemp: [...prevState.alunosTemp, { nomeAluno: '', matricula: '' }],
        }));
    };

    const removerAluno = (index) => {
        setState(prevState => ({
            ...prevState,
            alunosTemp: prevState.alunosTemp.filter((_, i) => i !== index),
        }));
    };

    const atualizarAluno = (index, campo, valor) => {
        const alunosAtualizados = state.alunosTemp.map((aluno, i) => {
            if (i === index) {
                return { ...aluno, [campo]: valor };
            }
            return aluno;
        });
        setState({ ...state, alunosTemp: alunosAtualizados });
    };

    const salvarProjeto = async () => {
        try {
            const novoProjeto = {
                nomeProjeto: state.nomeProjeto,
                curso: state.curso,
                tema: state.tema,
                periodoApresentacao: state.periodoApresentacao,
                notaAvaliacao: state.notaAvaliacao,
                grupo: state.alunosTemp,
                avaliador: {
                    nome: state.avaliador.nome || 'genericName',
                    email: state.avaliador.email || 'genericEmail',
                },
            };
            await addDoc(collection(db, 'Projetos Integradores'), novoProjeto);
            Alert.alert('Sucesso', 'Projeto cadastrado com sucesso!');
            setState(initialState);

            const projetosRef = collection(db, 'Projetos Integradores');
            const projetosSnapshot = await getDocs(projetosRef);
            const projetos = projetosSnapshot.docs.map(doc => doc.data());

            props.navigation.navigate('Projetos', { newListProjetos: projetos, user: user });
        } catch (error) {
            console.error('Erro ao cadastrar projeto:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao cadastrar o projeto. Por favor, tente novamente.');
        }
    };

    const editarProjeto = async () => {
        try {
            const projetoEditado = {
                id: state.id,
                nomeProjeto: state.nomeProjeto,
                curso: state.curso,
                tema: state.tema,
                periodoApresentacao: state.periodoApresentacao,
                notaAvaliacao: state.notaAvaliacao,
                grupo: state.grupo,
                avaliador: state.avaliador,
                
            };
            await setDoc(doc(db, 'Projetos Integradores', state.id), projetoEditado);
            Alert.alert('Sucesso', 'Projeto editado com sucesso!');
            setState(initialState);

            
            const projetosRef = collection(db, 'Projetos Integradores');
            const projetosSnapshot = await getDocs(projetosRef);
            const projetos = projetosSnapshot.docs.map(doc => doc.data());

            props.navigation.navigate('Projetos', { newListProjetos: projetos, user: user });
        } catch (error) {
            console.error('Erro ao editar projeto:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao editar o projeto. Por favor, tente novamente.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.titulo}>{projeto ? 'Editar Projeto' : 'Cadastrar Projeto'}</Text>

            <View style={styles.inputGroup}>
                <TextInput
                    placeholder='Nome do projeto'
                    placeholderTextColor={'#00427C'}
                    onChangeText={(value) => handleChangetext(value, 'nomeProjeto')}
                    value={state.nomeProjeto}
                    color={'#00427C'}
                />
            </View>

            <View style={styles.inputGroup}>
                <TextInput
                    placeholder='Curso'
                    placeholderTextColor={'#00427C'}
                    onChangeText={(value) => handleChangetext(value, 'curso')}
                    value={state.curso}
                    color={'#00427C'}
                />
            </View>

            <View style={styles.inputGroup}>
                <TextInput
                    placeholder='Tema'
                    placeholderTextColor={'#00427C'}
                    onChangeText={(value) => handleChangetext(value, 'tema')}
                    value={state.tema}
                    color={'#00427C'}
                />
            </View>

            <View style={styles.inputGroup}>
                <TextInput
                    placeholder='Período de Apresentação'
                    placeholderTextColor={'#00427C'}
                    onChangeText={(value) => handleChangetext(value, 'periodoApresentacao')}
                    value={state.periodoApresentacao}
                    color={'#00427C'}
                />
            </View>

            <ScrollView style={styles.inputGroup}>
                {projeto ? (
                    projeto.grupo.map((aluno, idx) => (
                        <View key={idx}>
                            <TextInput
                                placeholder='Nome do aluno'
                                placeholderTextColor={'#00427C'}
                                onChangeText={(value) => handleChangetext(value, 'grupo')}
                                value={aluno.nome}
                                color={'#00427C'}
                            />
                            <TextInput
                                placeholder='Matrícula do aluno'
                                placeholderTextColor={'#00427C'}
                                onChangeText={(value) => handleChangetext(value, 'grupo')}
                                value={aluno.matricula}
                                color={'#00427C'}
                            />
                        </View>
                    ))
                ) : (
                    <>
                        {state.alunosTemp.map((aluno, index) => (
                            <View key={index} style={styles.inputGroup}>
                                <TextInput
                                    placeholder='Nome do aluno'
                                    placeholderTextColor={'#00427C'}
                                    onChangeText={(value) => atualizarAluno(index, 'nomeAluno', value)}
                                    value={aluno.nomeAluno}
                                    color={'#00427C'}
                                />
                                <TextInput
                                    placeholder='Matrícula do aluno'
                                    placeholderTextColor={'#00427C'}
                                    onChangeText={(value) => atualizarAluno(index, 'matricula', value)}
                                    value={aluno.matricula}
                                    color={'#00427C'}
                                />
                                <Button title="Remover" onPress={() => removerAluno(index)} />
                            </View>
                        ))}
                        <Button title="Adicionar Aluno" onPress={adicionarAluno} />
                    </>
                )}
            </ScrollView>

            <View style={styles.containerButton}>
                <TouchableOpacity
                    style={styles.Button}
                    onPress={() => {
                        if (projeto) {
                            editarProjeto();
                        } else {
                            salvarProjeto();
                        }
                    }}
                >
                    <Text style={styles.TextoButton}>{projeto ? 'Salvar' : 'Cadastrar'}</Text>
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
        borderBottomColor: '#00427C',
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
        height: 35,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'black',
    },
    TextoButton: {
        fontSize: 18,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
});