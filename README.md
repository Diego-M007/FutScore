

---

# **Tutorial de Instalação do FutScore**

Este tutorial é voltado para usuários que desejam instalar e rodar o aplicativo **FutScore** diretamente a partir do código fonte, sem a necessidade de configurar o Firebase ou gerar um APK. O banco de dados já está configurado e rodando.

## **Pré-requisitos**

Antes de começar, certifique-se de ter os seguintes itens instalados no seu sistema:

- Node.js (versão 14 ou superior)
- Expo CLI (instalado globalmente)
- Git (para clonar o repositório)
- Dispositivo físico ou emulador Android/iOS para testar o app

## **Clonando o Repositório**

Primeiro, você precisa clonar o repositório do **FutScore** para o seu ambiente local. Abra o terminal e execute o comando abaixo:

```bash
git clone https://github.com/SeuUsuario/FutScore.git
cd FutScore
```

## **Instalando Dependências**

Dentro do diretório do projeto, execute o comando abaixo para instalar todas as dependências necessárias:

```bash
npm install
```

## **Executando o Aplicativo**

Após instalar as dependências e configurar as variáveis de ambiente, você pode iniciar o aplicativo. Para isso, execute o comando:

```bash
expo start
```

Isso abrirá o Expo Developer Tools em seu navegador. Para rodar o aplicativo, você pode:

- Em dispositivo físico: Escaneie o código QR exibido na tela usando o aplicativo Expo Go no seu dispositivo Android ou iOS.
- Emulador Android/iOS: Se estiver usando um emulador, selecione a opção correspondente na Expo Developer Tools.

## **Testando o Aplicativo**

Ao iniciar o aplicativo, você verá a animação inicial (Splash Screen) por alguns segundos antes de ser redirecionado para a página inicial do app, que exibe os jogos do dia.

## **Páginas do Aplicativo**

O **FutScore** inclui várias páginas e funcionalidades, como:

- Página de Partidas: Exibe as partidas do dia e detalhes de cada jogo.
- Página de Torneios: Lista os torneios disponíveis e detalhes sobre eles.
- Página de Perfil: Exibe e permite a edição do perfil do usuário.
- Página de Favoritos: Permite ao usuário visualizar e gerenciar seus times e jogadores favoritos.
- Login com Google: Permite ao usuário fazer login no aplicativo usando sua conta do Google.

## **Suporte**

Caso encontre problemas durante a instalação ou execução do aplicativo, verifique se todas as dependências estão instaladas corretamente e se as variáveis de ambiente foram configuradas. Para outras dúvidas, consulte o repositório no GitHub ou entre em contato com o suporte.

---
