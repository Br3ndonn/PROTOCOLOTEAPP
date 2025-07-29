import React from 'react';
import { View, Text, Modal, Image, TouchableOpacity, Dimensions, Alert, Platform } from 'react-native';

interface GraficoModalProps {
  visible: boolean;
  graficoUrl: string | null;
  onClose: () => void;
}

export const GraficoModal: React.FC<GraficoModalProps> = ({ visible, graficoUrl, onClose }) => {
  const showUrlAlert = () => {
    if (Platform.OS === 'web') {
      // Para web, usar window.alert
      window.alert(`URL da Imagem: ${graficoUrl || 'URL não disponível'}`);
    } else {
      // Para mobile, usar Alert.alert
      Alert.alert('URL da Imagem', graficoUrl || 'URL não disponível');
    }
  };

  const handleImageError = (error: any) => {
    console.error('Erro ao carregar imagem:', error);
    if (Platform.OS === 'web') {
      window.alert('Erro: Não foi possível carregar a imagem do gráfico');
    } else {
      Alert.alert('Erro', 'Não foi possível carregar a imagem do gráfico');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <View style={{
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 20,
          margin: 20,
          maxWidth: Dimensions.get('window').width - 40,
          maxHeight: Dimensions.get('window').height - 100
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 15,
            textAlign: 'center',
            color: '#374151'
          }}>
            📊 Gráfico de Evolução
          </Text>
          
          {graficoUrl && (
            <Image
              source={{ uri: graficoUrl }}
              style={{
                width: Dimensions.get('window').width - 80,
                height: 300,
                resizeMode: 'contain'
              }}
              onError={(error) => {
                handleImageError(error);
              }}
            />
          )}
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20
          }}>
            <TouchableOpacity 
              style={{
                backgroundColor: '#6366f1',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
                flex: 1,
                marginRight: 10
              }}
              onPress={showUrlAlert}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Ver URL</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{
                backgroundColor: '#6b7280',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
                flex: 1,
                marginLeft: 10
              }}
              onPress={onClose}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
