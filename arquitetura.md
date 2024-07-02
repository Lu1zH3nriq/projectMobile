# DOCUMENTAÇÃO DA APLICAÇÃO


```mermaid
sequenceDiagram
    participant Usuário
    participant Login
    participant FireBase
    participant Tela_Home
    participant Tela_Projetos

    Usuário->>Login: Insere os dados de login
    Login->>FireBase: Busca usuario
    FireBase-->>Login: Retorna usuario
    Login->>Tela_Home: Envia dados do usario
    Tela_Home->>Tela_Projetos: Envia o tipo de usuario
    Tela_Projetos-->>Usuário: Retorna os componentes que este usuário poderá ver e acessar
```