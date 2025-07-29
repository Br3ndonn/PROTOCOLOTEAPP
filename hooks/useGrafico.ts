import { useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { requisicaoService } from '@/api/requisicao';

interface GraficoHook {
  modalVisible: boolean;
  graficoUrl: string | null;
  testarConectividade: () => Promise<void>;
  gerarGrafico: (aprendizId: string, idPlanejamento: string) => Promise<void>;
  fecharModal: () => void;
}

export const useGrafico = (): GraficoHook => {
  const [modalVisible, setModalVisible] = useState(false);
  const [graficoUrl, setGraficoUrl] = useState<string | null>(null);

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const testarConectividade = useCallback(async () => {
    try {
      console.log('Testando conectividade básica...');
      
      const { data, error } = await requisicaoService.get('/');
      
      if (error) {
        showAlert(
          'Problema de Conectividade', 
          `❌ API não está acessível.\n\n📋 Checklist:\n\n1️⃣ Sua API está rodando?\n2️⃣ Está configurada para aceitar conexões externas?\n   • FastAPI: uvicorn main:app --host 0.0.0.0 --port 8000\n   • Express: app.listen(8000, '0.0.0.0')\n3️⃣ Firewall não está bloqueando a porta 8000?\n4️⃣ Dispositivos estão na mesma rede WiFi?\n\n🔗 URL testada: http://192.168.1.10:8000/\n\n❗ Erro: ${error}`
        );
        return;
      }

      showAlert(
        '✅ Conectividade OK!', 
        'Conexão com a API estabelecida com sucesso!\n\nAgora você pode gerar gráficos!'
      );

    } catch (error) {
      console.error('Erro ao testar conectividade:', error);
      showAlert(
        'Erro de Rede', 
        `❌ Falha na conectividade.\n\n🔧 Verifique:\n• API rodando em http://192.168.1.10:8000\n• Mesmo WiFi em ambos dispositivos\n• Firewall/antivírus não bloqueando\n\n📱 Erro técnico: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      );
    }
  }, []);

  const gerarGrafico = useCallback(async (aprendizId: string, idPlanejamento: string) => {
    try {
      const url = `/aprendiz/${aprendizId}/atividade/${idPlanejamento}/evolucao.png`;
      const fullUrl = `http://192.168.1.10:8000${url}`;
      
      console.log('Gerando gráfico para URL:', fullUrl);
      
      const { data, error } = await requisicaoService.get(url);
      
      if (error) {
        showAlert(
          'Gráfico não encontrado', 
          `⚠️ Não foi possível gerar o gráfico.\n\n🔗 URL: ${url}\n\n💡 Verifique se:\n• O endpoint está implementado\n• O ID da atividade (${idPlanejamento}) existe\n• Há dados suficientes para gerar o gráfico\n\n❗ Erro: ${error}`
        );
        return;
      }

      setGraficoUrl(fullUrl);
      setModalVisible(true);
      
      console.log('🎯 Gráfico carregado com sucesso!');

    } catch (error) {
      console.error('Erro ao gerar gráfico:', error);
      showAlert(
        'Erro ao Gerar Gráfico', 
        `❌ Erro inesperado ao gerar gráfico.\n\n📱 Erro técnico: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      );
    }
  }, []);

  const fecharModal = useCallback(() => {
    setModalVisible(false);
    setGraficoUrl(null);
  }, []);

  return {
    modalVisible,
    graficoUrl,
    testarConectividade,
    gerarGrafico,
    fecharModal
  };
};
