import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Home(props) {
    const { user } = props.route.params;
    

    const userTypes = {
        0: 'Admin',
        1: 'Aluno',
        2: 'Professor',
    };

    return (
        <View style={styles.container}>
            <View style={styles.userData}>
                <Text style={styles.userName}>{user?.nome}</Text>
                <Text style={styles.userType}>{userTypes[user?.tipo]}</Text>
            </View>
            {user?.tipo === 0 ? (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => { props.navigation.navigate('Cursos', { user: user }); }}>
                        <Text style={styles.buttonText}>Cursos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => { props.navigation.navigate('Alunos', { user: user }); }}>
                        <Text style={styles.buttonText}>Alunos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => { props.navigation.navigate('Projetos', { user: user }); }}>
                        <Text style={styles.buttonText}>Projetos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => { props.navigation.navigate('Usuarios', { user: user }); }}>
                        <Text style={styles.buttonText}>Usuários</Text>
                    </TouchableOpacity>
                </View>
            ) : user?.tipo === 1 ? (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => { props.navigation.navigate('Projetos', { user: user }); }}>
                        <Text style={styles.buttonText}>P.I. Atual</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => { props.navigation.navigate('Projetos', { user: user, apresentados: true }); }}>
                        <Text style={styles.buttonText}>P.I.'s Apresentados</Text>
                    </TouchableOpacity>
                </View>
            ) : user?.tipo === 2 ? (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => { props.navigation.navigate('Projetos', { user: user, avaliar: true }); }}>
                        <Text style={styles.buttonText}>Avaliar P.I</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => { props.navigation.navigate('Projetos', { user: user, avaliados: true }); }}>
                        <Text style={styles.buttonText}>P.I's Avaliados</Text>
                    </TouchableOpacity>
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userData: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#00427C'
    },
    userType: {
        fontSize: 18,
        color: '#00427C',
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#00427C',
        width: 200,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 12,
        borderColor: '#0D2136',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});
