import { professorService } from '@/services/ProfessorService'
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

export const signUpWithEmail = async (email: string, password: string, nomeCompleto?: string, eSupervisor?: boolean) => {
  try {
    console.log('Iniciando cadastro para:', email)
    
    // 1. Criar usuário no Supabase Auth
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

    console.log('Resultado da autenticação:', { authData, authError })

    if (authError) {
      console.error('Erro na autenticação:', authError)
      return { data: null, error: authError }
    }

    // 2. Se o usuário foi criado com sucesso, criar registro na tabela Professor
    if (authData.user) {
      const professorData = {
        id_professor: authData.user.id,     // UUID do usuário autenticado
        nome: nomeCompleto?.trim() || email.split('@')[0],
        email: email.toLowerCase().trim(),
        e_supervisor: eSupervisor || false  // Usar valor passado ou false por padrão
      }

      console.log('Tentando criar professor:', professorData)

      const { data: professorCriado, error: professorError } = await professorService.criar(professorData)

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

      console.log('Professor criado com sucesso:', professorCriado)
      return { 
        data: { 
          ...authData, 
          professor: professorCriado 
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
    .eq('id_professor', userId)
    .single()
  
  return { data, error }
}

// Função para sincronizar professor existente (para usuários que já existem)
export const sincronizarProfessor = async (user: any): Promise<{ success: boolean; error: any }> => {
  try {
    if (!user) {
      return { success: false, error: 'Usuário não fornecido' };
    }

    // Verificar se professor já existe
    const { exists, error: checkError } = await professorService.existe(user.id);
    
    if (checkError) {
      return { success: false, error: checkError };
    }

    // Se não existe, criar registro
    if (!exists) {
      const dadosProfessor = {
        id_professor: user.id,
        nome: user.user_metadata?.display_name || user.email?.split('@')[0] || 'Professor',
        email: user.email,
        e_supervisor: false // Por padrão, não é supervisor
      };

      const { data, error } = await professorService.criar(dadosProfessor);
      
      if (error) {
        return { success: false, error };
      }

      console.log('Professor sincronizado:', data);
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Erro na sincronização do professor:', error);
    return { success: false, error };
  }
};