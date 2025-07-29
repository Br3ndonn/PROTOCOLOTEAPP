import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView } from 'react-native';

// Hooks customizados
import { useAprendizDetalhes } from '@/hooks/useAprendizDetalhes';
import { useGrafico } from '@/hooks/useGrafico';
import { useUltimaAula } from '@/hooks/useUltimaAula';

// Componentes específicos
import { BottomActions } from '@/components/student-details/BottomActions';
import { GraficoModal } from '@/components/student-details/GraficoModal';
import { InformacoesBasicas } from '@/components/student-details/InformacoesBasicas';
import { InformacoesComplementares } from '@/components/student-details/InformacoesComplementares';
import { ErrorScreen, LoadingScreen } from '@/components/student-details/ScreenStates';
import { TabContainer } from '@/components/student-details/TabContainer';
import { UltimaAulaSection } from '@/components/student-details/UltimaAulaSection';

// Styles
import { styles } from '@/styles/AlunoDetalhesStyles';

export default function AlunoDetalhesScreen() {
  const params = useLocalSearchParams();
  const [abaAtiva, setAbaAtiva] = useState<'basicas' | 'complementares'>('basicas');
  
  // Hooks customizados
  const { aprendiz, loading, error, recarregar } = useAprendizDetalhes(params.id);
  const { ultimaAulaInfo, loading: loadingUltimaAula, expanded, toggleExpanded } = useUltimaAula();
  const { modalVisible, graficoUrl, testarConectividade, gerarGrafico, fecharModal } = useGrafico();

  // Handlers
  const handleGerarGrafico = () => {
    console.log('Botão Gerar Gráfico clicado!');
    console.log('ID do aprendiz:', params.id);
    
    if (Platform.OS === 'web') {
      // Para web, usar confirm/prompt
      const opcao = window.confirm('Gerar Gráfico de Evolução\n\nDeseja usar o ID padrão (1) ou testar conectividade?\n\nOK = Usar ID Padrão (1)\nCancelar = Testar Conectividade');
      
      if (opcao) {
        gerarGrafico(params.id as string, '1');
      } else {
        testarConectividade();
      }
    } else {
      // Para mobile, usar Alert.alert
      Alert.alert(
        'Gerar Gráfico de Evolução',
        'Digite o ID da atividade para gerar o gráfico:',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Usar ID Padrão (1)', 
            onPress: () => gerarGrafico(params.id as string, '1')
          },
          { 
            text: 'Testar Conectividade', 
            onPress: testarConectividade
          }
        ]
      );
    }
  };

  const handleGoBack = () => router.back();

  // Estados de carregamento e erro
  if (loading) {
    return (
      <ScreenWrapper title="Carregando...">
        <LoadingScreen />
      </ScreenWrapper>
    );
  }

  if (error || !aprendiz) {
    return (
      <ScreenWrapper title="Erro">
        <ErrorScreen 
          error={error} 
          onRetry={recarregar} 
          onGoBack={handleGoBack}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper title={`Detalhes - ${aprendiz.nome}`}>
      {/* Modal para exibir o gráfico */}
      <GraficoModal 
        visible={modalVisible}
        graficoUrl={graficoUrl}
        onClose={fecharModal}
      />

      {/* Sistema de Abas */}
      <TabContainer 
        abaAtiva={abaAtiva} 
        onTabChange={setAbaAtiva} 
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {abaAtiva === 'basicas' ? (
          <>
            <InformacoesBasicas aprendiz={aprendiz} />
            <UltimaAulaSection 
              aprendizId={params.id as string}
              ultimaAulaInfo={ultimaAulaInfo}
              loading={loadingUltimaAula}
              expanded={expanded}
              onToggle={toggleExpanded}
            />
          </>
        ) : (
          <InformacoesComplementares aprendiz={aprendiz} />
        )}
      </ScrollView>

      <BottomActions 
        aprendizId={params.id as string}
        onGerarGrafico={handleGerarGrafico}
      />
    </ScreenWrapper>
  );
}
