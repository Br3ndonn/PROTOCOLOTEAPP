# ProtocoloTEA 📊

<div align="center">
  <img src="./assets/images/icon.png" alt="ProtocoloTEA Logo" width="120" height="120">
  
  **Sistema de Acompanhamento Educacional para Transtorno do Espectro Autista**
  
  [![React Native](https://img.shields.io/badge/React%20Native-0.79.5-blue.svg)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-53.0.18-black.svg)](https://expo.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-2.50.3-green.svg)](https://supabase.com/)
</div>

## 📋 Sobre o Projeto

O **ProtocoloTEA** é uma aplicação móvel desenvolvida para auxiliar professores e terapeutas no acompanhamento educacional de aprendizes com Transtorno do Espectro Autista (TEA). O sistema permite o registro detalhado de atividades, monitoramento de progresso e geração de relatórios visuais para análise do desenvolvimento dos aprendizes.

### 🎯 Principais Funcionalidades

- **📝 Cadastro de Aprendizes**: Registro completo de informações pessoais, médicas e educacionais
- **👩‍🏫 Gestão de Professores**: Sistema de autenticação e perfis profissionais
- **📚 Planejamento de Atividades**: Criação e organização de atividades pedagógicas
- **📊 Registro de Aulas**: Documentação detalhada do progresso em cada sessão
- **⚡ Monitoramento de Intercorrências**: Registro de comportamentos e situações especiais
- **📈 Gráficos de Desempenho**: Visualização do progresso ao longo do tempo
- **🔍 Análise de Dados**: Relatórios e estatísticas de desenvolvimento

## 🏗️ Arquitetura do Sistema

### Stack Tecnológico

- **Frontend Mobile**: React Native + Expo
- **Linguagem**: TypeScript
- **Navegação**: Expo Router
- **Base de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Estado**: Context API + Custom Hooks
- **UI/UX**: React Native Paper + Componentes Customizados
- **Gráficos**: API FastAPI (Backend externo)

### Estrutura do Projeto

```
ProtocoloTEA/
├── app/                          # Telas principais da aplicação
│   ├── _layout.tsx              # Layout raiz com navegação
│   ├── index.tsx                # Tela inicial/dashboard
│   ├── LoginScreen.tsx          # Autenticação de usuários
│   ├── CadastroScreen.tsx       # Cadastro de novos professores
│   ├── CadastroAprendiz.tsx     # Cadastro de aprendizes
│   ├── Alunos.tsx               # Lista de aprendizes
│   ├── AlunoDetalhes.tsx        # Detalhes do aprendiz
│   ├── Formulario.tsx           # Registro de aulas
│   └── PerfilProfessor.tsx      # Perfil do professor
├── components/                   # Componentes reutilizáveis
│   ├── auth/                    # Componentes de autenticação
│   ├── formulario/              # Componentes do formulário de aulas
│   ├── student-details/         # Componentes de detalhes do aprendiz
│   ├── shared/                  # Componentes compartilhados
│   └── ui/                      # Componentes de interface
├── hooks/                       # Custom hooks
├── services/                    # Serviços de API e dados
├── contexts/                    # Contextos React
├── utils/                       # Utilitários e helpers
├── styles/                      # Estilos da aplicação
└── config/                      # Configurações
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- Expo CLI
- Conta no Supabase
- Emulador Android/iOS ou dispositivo físico

### 1. Clone o Repositório

```bash
git clone https://github.com/Br3ndonn/ProtocoloTEA.git
cd ProtocoloTEA
```

### 2. Instale as Dependências

```bash
npm install
# ou
yarn install
```

### 3. Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com/)
2. Copie as credenciais do projeto
3. Configure o arquivo `config/supabaseConfig.ts`:

```typescript
export const supabaseUrl = 'YOUR_SUPABASE_URL'
export const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
```

### 4. Configuração da API de Gráficos

Configure o endereço da API no arquivo `api/requisicao.ts`:

```typescript
// Para desenvolvimento local
const API_URL = 'http://SEU_IP_LOCAL:8000';
```

### 5. Execute a Aplicação

```bash
# Desenvolvimento
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 📱 Funcionalidades Detalhadas

### Sistema de Autenticação
- Login seguro com email e senha
- Cadastro de novos professores
- Recuperação de senha
- Perfis diferenciados (Professor/Supervisor)

### Gestão de Aprendizes
- **Cadastro Completo**: Dados pessoais, diagnóstico, histórico médico
- **Informações Familiares**: Responsáveis, contatos, relacionamentos
- **Perfil Educacional**: Interesses, qualidades, objetivos
- **Informações de Saúde**: Medicamentos, sono, alimentação

### Registro de Atividades
- **Planejamento de Intervenção**: Criação de planos personalizados
- **Registro de Aulas**: Documentação detalhada de cada sessão
- **Avaliação de Desempenho**: Pontuação, completude, tentativas
- **Intercorrências**: Registro de comportamentos e situações especiais
 - ![Interface](https://drive.google.com/file/d/1XPjSnST42FiQEFICkgU8aEGnmkYO0EjC/view?usp=drive_link)
 - ![Interface](https://drive.google.com/file/d/1fUjaP1grVMH-2JXvP4m-6XdnayiEYdrf/view?usp=drive_link)
### Análise e Relatórios
- **Gráficos de Evolução**: Visualização do progresso temporal
- **Estatísticas Detalhadas**: Análise quantitativa do desempenho
- **Relatórios Personalizados**: Documentos para acompanhamento
- **Modo Tela Cheia**: Visualização otimizada de gráficos

## 🔧 Arquitetura de Componentes

### Hooks Customizados
- `useAuth`: Gerenciamento de autenticação
- `useAprendizDetalhes`: Dados do aprendiz
- `useGrafico`: Geração e exibição de gráficos
- `useToast`: Sistema de notificações
- `useAtividadesTemporarias`: Gestão temporária de atividades

### Serviços
- `AprendizService`: CRUD de aprendizes
- `AulaService`: Gestão de aulas
- `ProfessorService`: Dados dos professores
- `ProgressoAtividadeService`: Acompanhamento de atividades
- `IntercorrenciaService`: Registro de intercorrências

### Componentes Principais
- `ScreenWrapper`: Layout base das telas
- `GerenciadorAtividades`: Interface de atividades
- `GraficoModal`: Visualização de gráficos
- `Toast`: Sistema de notificações
- `TabContainer`: Navegação por abas

## 🎨 Design System

### Paleta de Cores
- **Primary**: `#6366f1` (Indigo)
- **Success**: `#10b981` (Emerald)
- **Error**: `#ef4444` (Red)
- **Warning**: `#f59e0b` (Amber)
- **Info**: `#3b82f6` (Blue)

### Tipografia
- **Font Family**: System Default
- **Sizes**: 12px, 14px, 16px, 18px, 20px, 24px, 32px

### Componentes de UI
- Botões consistentes com estados visuais
- Cards com sombras e bordas arredondadas
- Inputs com validação visual
- Modais responsivos
- Sistema de ícones baseado em SF Symbols

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes com watch
npm run test:watch

# Coverage
npm run test:coverage
```

### Estrutura de Testes
```
__tests__/
├── components/     # Testes de componentes
├── hooks/         # Testes de hooks
├── services/      # Testes de serviços
├── utils/         # Testes de utilitários
└── integration/   # Testes de integração
```

## 📚 Scripts Disponíveis

```bash
npm start          # Inicia o servidor de desenvolvimento
npm run android    # Executa no emulador Android
npm run ios        # Executa no simulador iOS
npm run web        # Executa na web
npm run lint       # Executa o linter
npm test           # Executa os testes
```

## 🤝 Contribuição

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
- **TypeScript**: Tipagem rigorosa obrigatória
- **ESLint**: Seguir as regras configuradas
- **Prettier**: Formatação automática
- **Conventional Commits**: Padrão de mensagens de commit

### Estrutura de Commits
```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formatação e estilo
refactor: refatoração de código
test: adiciona ou atualiza testes
chore: tarefas de manutenção
```

## 📊 Banco de Dados

### Principais Tabelas
- **Aprendiz**: Dados dos aprendizes
- **Professor**: Informações dos professores
- **Aula**: Registros de sessões
- **Progresso_atividades**: Acompanhamento de atividades
- **Planejamento_atividades**: Definição de atividades
- **Intercorrencia**: Tipos de intercorrências
- **Registro_intercorrencia**: Ocorrências registradas

### Relacionamentos
```sql
Aprendiz 1:N Planejamento_intervencao
Planejamento_intervencao 1:N Aula
Aula 1:N Progresso_atividades
Progresso_atividades 1:N Registro_intercorrencia
```

## 🔒 Segurança

- **Autenticação**: JWT tokens via Supabase
- **Autorização**: Row Level Security (RLS)
- **Validação**: Validação de dados no frontend e backend
- **Sanitização**: Limpeza de inputs do usuário
- **HTTPS**: Comunicação segura obrigatória

## 📈 Performance

### Otimizações Implementadas
- **Lazy Loading**: Carregamento sob demanda
- **Memoização**: React.memo e useMemo
- **Virtual Lists**: Para grandes listas de dados
- **Image Caching**: Cache inteligente de imagens
- **Bundle Splitting**: Divisão do código

### Monitoramento
- Performance metrics via Expo
- Error tracking com Sentry (configurável)
- Analytics de uso (opcional)

## 🌐 Deployment

### Expo Build
```bash
# Build para Android
expo build:android

# Build para iOS
expo build:ios

# Update OTA
expo publish
```

### Configurações de Build
- **Android**: Configurado para Google Play Store
- **iOS**: Configurado para App Store
- **Web**: Deploy automático via Netlify/Vercel
