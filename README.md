

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

# **Manual do Usuário - FutScore**

## **Introdução**

Bem-vindo ao **FutScore**! Este aplicativo foi criado para que você possa acompanhar de perto as partidas, torneios e as estatísticas detalhadas de seus times e jogadores favoritos em tempo real. Este manual vai te guiar através de cada página do aplicativo para que você possa aproveitar ao máximo todas as funcionalidades oferecidas com exclusividade focada no futebol.

## **Página Inicial - Partidas**

A página inicial do **FutScore** é onde você encontrará todas as informações sobre as partidas em andamento, as que já ocorreram e as futuras. Nessa página, você poderá:

- Visualizar uma lista das partidas com detalhes sobre o placar, times envolvidos, data e hora.
- Filtrar as partidas por diferentes categorias, como competições específicas ou times favoritos.
- Clicar em uma partida para ver mais detalhes sobre o jogo, incluindo estatísticas em tempo real, eventos do jogo e escalações.

## **Página de Torneios**

Na página de Torneios, você pode acessar informações detalhadas sobre as competições disponíveis no aplicativo. As funcionalidades incluem:

- Visualizar a lista de torneios em andamento, futuros e finalizados.
- Ver a classificação atual dos times dentro de um torneio específico.
- Acompanhar a tabela de jogos, resultados e próximos confrontos.
- Obter informações detalhadas sobre cada fase do torneio, desde a fase de grupos até as finais.

## **Página de Perfil**

**Objetivo:**
Nesta página, o usuário pode gerenciar seu perfil, incluindo login com Google para acessar funcionalidades adicionais.

**Funcionalidades:**

- **Login com Google:** Permite que os usuários façam login com sua conta Google.
- **Modal de Login:** Ao clicar em "Entrar", um modal é aberto para login com mais informações sobre os benefícios do aplicativo.
- **Vídeo de Propaganda:** Exibido dentro do modal para promover o aplicativo.

**Como usar:**

- Navegue até a página de Perfil e clique em "Entrar" para iniciar o processo de login.
- Dentro do modal, siga as instruções para fazer login com Google.

A página de Perfil permite que você gerencie sua conta e personalize sua experiência no aplicativo. Nessa página, você pode:

- Visualizar e editar suas informações pessoais, como nome, e-mail e foto de perfil.
- Acessar suas preferências e ajustar configurações de notificações, temas e privacidade.
- Ver suas atividades recentes, incluindo partidas assistidas, times seguidos e interações no aplicativo.
- Gerenciar seus times e jogadores favoritos, facilitando o acesso rápido a informações relevantes.

## **Página de Favoritos**

A página de Favoritos é onde você pode acompanhar de perto os times, jogadores e competições que você marcou como favoritos. Nesta página, você pode:

- Fazer login para acessar seus itens favoritos.
- Ver uma lista personalizada de partidas, jogadores e torneios de acordo com suas preferências.
- Receber notificações e atualizações sobre seus favoritos para nunca perder um momento importante.
- Acessar estatísticas detalhadas e acompanhar o desempenho dos seus favoritos ao longo da temporada.

## **Página de Detalhes do Jogo**

Na página de Detalhes do Jogo, você encontrará uma visão aprofundada de cada partida. As funcionalidades incluem:

- Visualizar informações detalhadas sobre o jogo, como data, hora, local e árbitro.
- Conferir as escalações iniciais dos times e possíveis substituições durante o jogo.
- Acompanhar eventos em tempo real, como gols, cartões e substituições.
- Ver as estatísticas da partida, incluindo posse de bola, chutes a gol, faltas, escanteios e muito mais.
- Acessar o histórico de confrontos diretos entre os times envolvidos.

## **Conclusão**

Este manual cobre as principais funcionalidades do **FutScore**. Esperamos que este guia tenha ajudado a entender como usar o aplicativo de forma eficiente. Se tiver dúvidas ou precisar de suporte, não hesite em entrar em contato através do suporte do aplicativo.

Aproveite o **FutScore** e fique sempre atualizado com as emoções do futebol!

---
