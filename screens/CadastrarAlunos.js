import React, { useState } from 'react';
import { Alert, ScrollView, TextInput, Button, StyleSheet } from 'react-native';
import appFirebase from '../credenciaisFirebase';
import { getFirestore, collection, addDoc, getDocs, setDoc, doc } from 'firebase/firestore';

const db = getFirestore(appFirebase);

export default function CadastrarAlunos(props) {
    const { aluno } = props?.route?.params || {};
    const { idAluno } = props?.route?.params || {};


    const initialState = {
        nome: '',
        cursoGraduacao: '',
        matricula: '',
        periodoAtual: '',
        periodosCursado: '',
    }

    const editAluno = {
        nome: aluno ? aluno.nome : '',
        cursoGraduacao: aluno ? aluno.cursoGraduacao : '',
        matricula: aluno ? aluno.matricula : '',
        periodoAtual: aluno ? aluno.periodoAtual : '',
        periodosCursado: aluno ? aluno.periodosCursado : '',
    }

    const [_aluno, setAluno] = useState(aluno ? editAluno : initialState);

    const handleChange = (name, value) => {
        // if (name === 'periodosCursado') {
        //     value = parseInt(value, 10);
        // }
        setAluno({ ..._aluno, [name]: value });
    };

    const handleSubmit = async () => {

        if (!_aluno || !_aluno.nome || !_aluno.periodoAtual || !_aluno.periodosCursado) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        try {
            await addDoc(collection(db, 'Alunos'), _aluno);
            const alunosRef = collection(db, 'Alunos');
            const alunosSnapshot = await getDocs(alunosRef);
            const alunosData = alunosSnapshot.docs.map((doc, index) => ({
                key: `${doc.id}-${index}`,
                ...doc.data()
            }));
            props.navigation.navigate('Alunos', { newListAlunos: alunosData });
            Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
        } catch (error) {
            console.error('Erro ao cadastrar aluno:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao cadastrar o aluno. Por favor, tente novamente.');
        }


    };


    const editarAluno = async () => {
        if (_aluno.nome && _aluno.cursoGraduacao && _aluno.matricula && _aluno.periodoAtual && _aluno.periodosCursado) {
            const alunoEditado = {
                id: idAluno,
                nome: _aluno.nome,
                cursoGraduacao: _aluno.cursoGraduacao,
                matricula: _aluno.matricula,
                periodoAtual: _aluno.periodoAtual,
                periodosCursado: _aluno.periodosCursado,
            };
            try {
                await setDoc(doc(db, 'Alunos', idAluno), alunoEditado);
                Alert.alert('Sucesso', 'Aluno editado com sucesso!');
                setAluno(initialState);
                const alunosRef = collection(db, 'Alunos');
                const alunosSnapshot = await getDocs(alunosRef);
                const alunosData = alunosSnapshot.docs.map((doc, index) => ({
                    key: `${doc.id}-${index}`,
                    ...doc.data()
                }));
                props.navigation.navigate('Alunos', { newListAlunos: alunosData })
            } catch (error) {
                console.error('Erro ao editar aluno:', error);
                Alert.alert('Erro', 'Ocorreu um erro ao editar o aluno. Por favor, tente novamente.');
            }
        } else {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
        }

    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={_aluno.nome}
                onChangeText={(text) => handleChange('nome', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Curso de Graduação"
                value={_aluno.cursoGraduacao}
                onChangeText={(text) => handleChange('cursoGraduacao', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Matrícula"
                value={_aluno.matricula}
                onChangeText={(text) => handleChange('matricula', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Período Atual"
                value={_aluno.periodoAtual}
                onChangeText={(text) => handleChange('periodoAtual', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Períodos Cursados"
                value={_aluno.periodosCursado.toString()}
                keyboardType="numeric"
                onChangeText={(text) => handleChange('periodosCursado', text)}
            />
            <Button title={_aluno ? 'Salvar' : 'Cadastrar'} onPress={() => {
                if (_aluno) {
                    editarAluno();
                }
                else {
                    handleSubmit();
                }
            }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
    },
    input: {
        height: 40,
        marginBottom: 12,
        borderWidth: 1,
        padding: 10,
    },
});