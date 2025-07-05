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
        nome: nomeCompleto,
        email: email,          
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
    
    // Verificar políticas RLS
    const rlsCheck = await checkProfessorRLSPolicies()
    console.log('Verificação RLS:', rlsCheck)
    
    // 1. Criar usuário no Supabase Auth com metadados
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: nomeCompleto?.trim() || email.split('@')[0],
          full_name: nomeCompleto?.trim() || email.split('@')[0],
        }
      }
    })

    console.log('=== RESULTADO AUTH ===')
    console.log('User ID:', authData?.user?.id)
    console.log('Display Name:', authData?.user?.user_metadata?.display_name)
    console.log('Email confirmado:', authData?.user?.email_confirmed_at)
    console.log('Erro auth:', authError)

    if (authError) {
      return { data: null, error: authError }
    }

    if (!authData.user?.id) {
      console.error('User ID não foi gerado')
      return { data: authData, error: { message: 'ID do usuário não foi gerado' } }
    }

    // 2. Aguardar a sessão ser estabelecida e atualizar perfil
    if (authData.user && nomeCompleto) {
      try {
        // Aguardar um pouco para a sessão ser estabelecida
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Verificar se a sessão está ativa
        const { data: session } = await supabase.auth.getSession()
        
        if (session?.session) {
          const { error: updateError } = await supabase.auth.updateUser({
            data: {
              display_name: nomeCompleto.trim(),
              full_name: nomeCompleto.trim(),
            }
          })

          if (updateError) {
            console.warn('Erro ao atualizar perfil do usuário:', updateError)
          } else {
            console.log('Perfil do usuário atualizado com sucesso')
          }
        } else {
          console.warn('Sessão não encontrada, pulando atualização do perfil')
        }
      } catch (updateErr) {
        console.warn('Falha ao atualizar metadados do usuário:', updateErr)
      }
    }

    // 3. Tentar inserir na tabela Professor com diferentes abordagens
    const professorData = {
      id: authData.user.id,
      nome: nomeCompleto?.trim() || email.split('@')[0],
      email: email.toLowerCase().trim(),
    }

    console.log('=== TENTATIVA 1: INSERT BÁSICO ===')
    console.log('Dados para inserir:', professorData)

    // Tentativa 1: Insert básico - usando a sessão do usuário
    const { data: currentSession } = await supabase.auth.getSession()
    
    console.log('Sessão atual:', currentSession?.session ? 'Ativa' : 'Inativa')
    
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

// Função para verificar e corrigir políticas RLS da tabela Professor
export const checkProfessorRLSPolicies = async () => {
  try {
    console.log('Verificando políticas RLS da tabela Professor...')
    
    // Primeiro, tentar uma consulta simples para testar acesso
    const { data, error } = await supabase
      .from('Professor')
      .select('id')
      .limit(1)
    
    if (error && error.code === '42501') {
      console.log('❌ RLS está bloqueando acesso à tabela Professor')
      console.log('Soluções possíveis:')
      console.log('1. Desabilitar RLS temporariamente no Supabase Dashboard')
      console.log('2. Criar políticas RLS adequadas')
      console.log('3. Usar service_role key (apenas para desenvolvimento)')
      
      return { 
        hasAccess: false, 
        error: 'RLS está bloqueando inserções na tabela Professor',
        code: error.code 
      }
    }
    
    console.log('✅ Acesso à tabela Professor está funcionando')
    return { hasAccess: true, error: null }
    
  } catch (error) {
    console.error('Erro ao verificar RLS:', error)
    return { 
      hasAccess: false, 
      error: 'Erro ao verificar políticas RLS' 
    }
  }
}