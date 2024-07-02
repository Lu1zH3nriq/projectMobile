import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator, Modal, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/FontAwesome5';

//importar firebase
import appFirebase from '../credenciaisFirebase';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore'

const db = getFirestore(appFirebase)

export default function Projetos(props) {
    const { user } = props?.route?.params;
    const { apresentados } = props?.route?.params;
    const { avaliados } = props?.route?.params;
    const { newListProjetos } = props?.route?.params || [];
    const [projetos, setProjetos] = useState([]);
    const [aluno, setAluno] = useState({});
    const [avaliarModal, setAvaliarModal] = useState({
        projeto: {},
        avaliador: {},
        status: false,
    });

    const [nota, setNota] = useState('');

    const [projetosAluno, setProjetosAluno] = useState([]);
    const [projetosAlunoApresentados, setProjetosAlunoApresentados] = useState([]);

    const [projetosAvaliados, setProjetosAvaliados] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.tipo === 1) {
            const fetchAluno = async () => {
                try {
                    const queryAluno = await getDocs(collection(db, 'Alunos'));
                    let aluno = {};
                    const alunos = queryAluno.docs.map(doc => doc.data());
                    const alunoEncontrado = alunos.find(aluno => aluno.email === user.email);

                    if (alunoEncontrado) {
                        aluno = alunoEncontrado;
                    }
                    setAluno(aluno);

                } catch (error) {
                    console.error('Erro ao buscar dados do aluno:', error);
                }
            };
            fetchAluno();
            setProjetosAluno(projetos.filter(proj => proj.grupo.some(integrante => integrante.matricula === aluno.matricula)))
            setProjetosAlunoApresentados(projetos.filter(proj => proj.grupo.some(integrante => integrante.matricula === aluno.matricula) && proj.notaAvaliacao > 0 && proj.periodoApresentacao < aluno.periodoAtual))
        }

        if (user?.tipo === 2) {
            const fetchProjetos = async () => {
                try {
                    const queryProjetos = await getDocs(collection(db, 'Projetos Integradores'));
                    let projetos = [];
                    const _projetos = queryProjetos.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    const _projetosAvaliador = _projetos.filter(projeto => projeto.avaliador.email === user.email);

                    if (_projetosAvaliador.length > 0) {
                        projetos = _projetosAvaliador;
                    }
                    setProjetos(_projetos);
                    setProjetosAvaliados(projetos);

                } catch (error) {
                    console.error('Erro ao buscar projetos avaliados: ', error);
                }
            };
            fetchProjetos();


        }
    }, [props, user, projetos]);

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
            setProjetosAluno(projData);
            setProjetosAlunoApresentados(projData);

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

    const avaliaProjeto = async (projeto, avaliador, nota) => {
        try {
            const projetoEditado = {
                id: projeto.id,
                nomeProjeto: projeto.nomeProjeto,
                curso: projeto.curso,
                tema: projeto.tema,
                periodoApresentacao: projeto.periodoApresentacao,
                notaAvaliacao: nota,
                grupo: projeto.grupo,
                avaliador: {
                    nome: avaliador.nome,
                    email: avaliador.email
                },
            };
            await setDoc(doc(db, 'Projetos Integradores', projeto.id), projetoEditado);
            Alert.alert('Sucesso', 'Projeto avaliado com sucesso!');
            const queryProjetos = await getDocs(collection(db, 'Projetos Integradores'));
            let projetos = [];
            const _projetos = queryProjetos.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            const _projetosAvaliador = _projetos.filter(projeto => projeto.avaliador.email === user.email);

            if (_projetosAvaliador.length > 0) {
                projetos = _projetosAvaliador;
            }
            setProjetos(_projetos);
            setProjetosAvaliados(projetos);
            setAvaliarModal({
                projeto: {},
                avaliador: {},
                status: false,
            });
        } catch (error) {
            console.error('Erro ao avaliar Projeto:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao avaliar o projeto. Por favor, tente novamente.');
        }
    }

    return (
        <>
            {user?.tipo === 0 ? (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => { props.navigation.navigate('Cadastrar Projetos') }}>
                        <Text style={styles.buttonText}>Cadastrar P.I</Text>
                    </TouchableOpacity>
                </View>
            ) : null}
            {!loading ? (
                user?.tipo === 0 ? (
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
                    user?.tipo === 1 ? (
                        !apresentados ? (
                            <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                                {projetosAluno.map((projeto, index) => (
                                    <View key={projeto.key || index} style={styles.cursoContainer}>
                                        <View style={styles.cursoRow}>
                                            <Text style={styles.cursoTitle}>{projeto.nomeProjeto}</Text>
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
                            <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                                {projetosAlunoApresentados.map((projeto, index) => (
                                    <View key={projeto.key || index} style={styles.cursoContainer}>
                                        <View style={styles.cursoRow}>
                                            <Text style={styles.cursoTitle}>{projeto.nomeProjeto}</Text>
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
                        )
                    ) : (
                        user?.tipo === 2 && (
                            !avaliados ? (
                                <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                                    {projetos.map((projeto, index) => (
                                        <View key={projeto.key || index} style={styles.cursoContainer}>
                                            <View style={styles.cursoRow}>
                                                <Text style={styles.cursoTitle}>{projeto.nomeProjeto}</Text>
                                                <View style={styles.iconContainer}>
                                                    <TouchableOpacity onPress={() => {
                                                        setAvaliarModal({
                                                            projeto: projeto,
                                                            avaliador: user,
                                                            status: true,
                                                        });
                                                    }}>
                                                        <Text style={{ color: 'white', paddingRight: 12 }}>Avaliar</Text>
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
                                <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                                    {projetosAvaliados.map((projeto, index) => (
                                        <View key={projeto.key || index} style={styles.cursoContainer}>
                                            <View style={styles.cursoRow}>
                                                <Text style={styles.cursoTitle}>{projeto.nomeProjeto}</Text>
                                                <View style={styles.iconContainer}>
                                                    <TouchableOpacity onPress={() => {
                                                        setAvaliarModal({
                                                            projeto: projeto,
                                                            avaliador: user,
                                                            status: true,
                                                        });
                                                    }}>
                                                        <Text style={{ color: 'white', paddingRight: 12 }}>Avaliar</Text>
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
                            )
                        )
                    )
                )
            ) : (
                <ActivityIndicator size="large" color="#00427C" />
            )}

            <Modal visible={avaliarModal.status} animationType="slide" transparent={true}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>AVALIAR PROJETO</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Nota</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                onChangeText={(text) => {
                                    setNota(text);
                                }}
                                value={nota}
                            />
                            <TouchableOpacity style={styles.buttonSave}
                                onPress={() => {
                                    avaliaProjeto(avaliarModal.projeto, avaliarModal.avaliador, nota);
                                }}>
                                <Text style={styles.buttonText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    modalContainer: {
        width: '80%',
    },
    modalTitle: {
        textAlign: 'center',
        color: "#FFF",
        fontSize: 20,
        fontWeight: "bold",
    },
    inputContainer: {
        backgroundColor: "#F05A28",
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
    label: {
        color: "#00427C",
        marginBottom: 10,
        fontSize: 20,
        fontWeight: "bold",
    },
    input: {
        borderColor: "#00427C",
        borderWidth: 1,
        padding: 10,
        color: "#00427C",
        fontSize: 20,
        fontWeight: "bold",
        width: "100%",
    },
    buttonSave: {
        marginTop: 20,
        backgroundColor: "#00427C",
        padding: 10,
        borderRadius: 5,
        width: "100%",
    },
    buttonText: {
        color: "white",
        fontSize: 17,
        fontWeight: "bold",
        textAlign: "center",
    }
});