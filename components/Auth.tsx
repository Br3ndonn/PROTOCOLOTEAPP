import { supabase } from '@/utils/supabase'
import { AppState, Platform } from 'react-native'

// Função para configurar o listener de AppState de forma segura
const setupAuthListener = () => {
  try {
    if (Platform.OS && typeof AppState !== 'undefined') {
      AppState.addEventListener('change', (state) => {
        if (state === 'active') {
          supabase.auth.startAutoRefresh()
        } else {
          supabase.auth.stopAutoRefresh()
        }
      })
    }
  } catch (error) {
    console.warn('Não foi possível configurar o listener de autenticação:', error)
  }
}

// Configurar listener apenas em runtime
if (typeof window !== 'undefined') {
  setupAuthListener()
}

// Auth configuration functions
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signUpWithEmail = async (email: string, password: string, nomeCompleto?: string) => {
  try {
    console.log('Iniciando cadastro para:', email)
    
    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    console.log('Resultado da autenticação:', { authData, authError })

    if (authError) {
      console.error('Erro na autenticação:', authError)
      return { data: null, error: authError }
    }

    // 2. Se o usuário foi criado com sucesso, criar registro na tabela Professor
    if (authData.user) {
      const professorData = {
        id: authData.user.id,     // UUID do usuário autenticado
        nome: nomeCompleto || email.split('@')[0], // Nome completo fornecido
        email: email,             // Email do usuário
      }

      console.log('Tentando inserir na tabela Professor:', professorData)

      const { data: insertedProfessor, error: professorError } = await supabase
        .from('Professor')
        .insert([professorData])
        .select()

      console.log('Resultado da inserção:', { insertedProfessor, professorError })

      if (professorError) {
        console.error('Erro ao criar professor:', professorError)
        // Nota: O usuário ainda foi criado no Auth, mas não na tabela Professor
        return { 
          data: authData, 
          error: { 
            message: `Usuário criado, mas erro ao salvar perfil: ${professorError.message}` 
          } 
        }
      }

      console.log('Professor criado com sucesso:', insertedProfessor[0])
      return { 
        data: { 
          ...authData, 
          professor: insertedProfessor[0] 
        }, 
        error: null 
      }
    } else {
      console.log('authData.user é null ou undefined')
    }

    return { data: authData, error: null }
    
  } catch (error) {
    console.error('Erro no cadastro:', error)
    return { 
      data: null, 
      error: { 
        message: 'Erro inesperado durante o cadastro' 
      } 
    }
  }
}

// Versão alternativa com retry para inserção na tabela Professor
export const signUpWithEmailAndRetry = async (email: string, password: string, nomeCompleto?: string) => {
  try {
    console.log('=== INICIANDO CADASTRO ===')
    console.log('Email:', email)
    console.log('Nome:', nomeCompleto)
    
    // Primeiro, testar se a tabela está acessível
    const tableTest = await testProfessorTable()
    console.log('Teste da tabela Professor:', tableTest)
    
    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    console.log('=== RESULTADO AUTH ===')
    console.log('User ID:', authData?.user?.id)
    console.log('Email confirmado:', authData?.user?.email_confirmed_at)
    console.log('Erro auth:', authError)

    if (authError) {
      return { data: null, error: authError }
    }

    if (!authData.user?.id) {
      console.error('User ID não foi gerado')
      return { data: authData, error: { message: 'ID do usuário não foi gerado' } }
    }

    // 2. Tentar inserir na tabela Professor com diferentes abordagens
    const professorData = {
      id: authData.user.id,
      nome: nomeCompleto?.trim() || email.split('@')[0],
      email: email.toLowerCase().trim(),
    }

    console.log('=== TENTATIVA 1: INSERT BÁSICO ===')
    console.log('Dados para inserir:', professorData)

    // Tentativa 1: Insert básico
    let { data: insertedProfessor, error: professorError } = await supabase
      .from('Professor')
      .insert(professorData)
      .select()

    console.log('Resultado tentativa 1:', { insertedProfessor, professorError })

    // Se falhou, tentar abordagem alternativa
    if (professorError && professorError.code) {
      console.log('=== TENTATIVA 2: INSERT COM UPSERT ===')
      
      const { data: upsertData, error: upsertError } = await supabase
        .from('Professor')
        .upsert(professorData, { 
          onConflict: 'id'
        })
        .select()

      console.log('Resultado tentativa 2:', { upsertData, upsertError })
      
      if (!upsertError) {
        insertedProfessor = upsertData
        professorError = null
      }
    }

    if (professorError) {
      console.error('=== ERRO FINAL NA INSERÇÃO ===')
      console.error('Código do erro:', professorError.code)
      console.error('Mensagem:', professorError.message)
      console.error('Detalhes:', professorError.details)
      console.error('Hint:', professorError.hint)
      
      return { 
        data: authData, 
        error: { 
          message: `Usuário criado, mas erro ao salvar perfil: ${professorError.message}`,
          details: professorError
        } 
      }
    }

    console.log('=== SUCESSO ===')
    console.log('Professor criado:', insertedProfessor?.[0])
    
    return { 
      data: { 
        ...authData, 
        professor: insertedProfessor?.[0] 
      }, 
      error: null 
    }
    
  } catch (error) {
    console.error('=== ERRO CRÍTICO ===', error)
    return { 
      data: null, 
      error: { 
        message: 'Erro inesperado durante o cadastro',
        details: error
      } 
    }
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = () => {
  return supabase.auth.getUser()
}

export const getSession = () => {
  return supabase.auth.getSession()
}

// Listen to auth changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback)
}

// Função para buscar dados do professor pelo ID do usuário
export const getProfessorByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('Professor')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}

// Função para testar se a tabela Professor existe e está acessível
export const testProfessorTable = async () => {
  try {
    console.log('Testando acesso à tabela Professor...')
    const { data, error } = await supabase
      .from('Professor')
      .select('*')
      .limit(1)
    
    console.log('Resultado do teste:', { data, error })
    return { success: !error, error }
  } catch (error) {
    console.error('Erro ao testar tabela:', error)
    return { success: false, error }
  }
}