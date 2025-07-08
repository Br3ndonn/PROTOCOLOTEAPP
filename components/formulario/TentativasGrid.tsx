import { styles } from '@/styles/FormularioStyles';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { TentativaData } from './types';

interface TentativasGridProps {
  tentativas: TentativaData[];
  onUpdatePontuacao: (tentativaId: string, value: number) => void;
}

const TentativasGrid: React.FC<TentativasGridProps> = ({
  tentativas,
  onUpdatePontuacao
}) => {
  return (
    <View style={styles.tentativasSection}>
      <Text style={styles.tentativasTitle}>Desempenho nas Tentativas</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tentativasContainer}>
        {tentativas.map((tentativa) => (
          <View key={tentativa.id} style={styles.tentativaCard}>
            {/* Grid de pontuações */}
            <View style={styles.pontuacaoGrid}>
              {/* Linha superior: 8 e 10 */}
              <View style={styles.pontuacaoRow}>
                <TouchableOpacity
                  style={[
                    styles.pontuacaoButton,
                    tentativa.pontuacao === 8 && styles.pontuacaoButtonSelected
                  ]}
                  onPress={() => onUpdatePontuacao(tentativa.id, 8)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.pontuacaoText,
                    tentativa.pontuacao === 8 && styles.pontuacaoTextSelected
                  ]}>8</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.pontuacaoButton,
                    tentativa.pontuacao === 10 && styles.pontuacaoButtonSelected
                  ]}
                  onPress={() => onUpdatePontuacao(tentativa.id, 10)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.pontuacaoText,
                    tentativa.pontuacao === 10 && styles.pontuacaoTextSelected
                  ]}>10</Text>
                </TouchableOpacity>
              </View>

              {/* Linha inferior: 2 e 4 */}
              <View style={styles.pontuacaoRow}>
                <TouchableOpacity
                  style={[
                    styles.pontuacaoButton,
                    tentativa.pontuacao === 2 && styles.pontuacaoButtonSelected
                  ]}
                  onPress={() => onUpdatePontuacao(tentativa.id, 2)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.pontuacaoText,
                    tentativa.pontuacao === 2 && styles.pontuacaoTextSelected
                  ]}>2</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.pontuacaoButton,
                    tentativa.pontuacao === 4 && styles.pontuacaoButtonSelected
                  ]}
                  onPress={() => onUpdatePontuacao(tentativa.id, 4)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.pontuacaoText,
                    tentativa.pontuacao === 4 && styles.pontuacaoTextSelected
                  ]}>4</Text>
                </TouchableOpacity>
              </View>

              {/* Botão 0 ocupando toda a largura */}
              <TouchableOpacity
                style={[
                  styles.pontuacaoButtonFull,
                  tentativa.pontuacao === 0 && styles.pontuacaoButtonSelected
                ]}
                onPress={() => onUpdatePontuacao(tentativa.id, 0)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.pontuacaoText,
                  tentativa.pontuacao === 0 && styles.pontuacaoTextSelected
                ]}>0</Text>
              </TouchableOpacity>
            </View>

            {/* Label da tentativa */}
            <Text style={styles.tentativaTitle}>{tentativa.nome}</Text>

            {/* Pontuação selecionada */}
            <View style={styles.pontuacaoSelecionada}>
              <Text style={styles.pontuacaoSelecionadaLabel}>Pontuação</Text>
              <Text style={styles.pontuacaoSelecionadaValue}>{tentativa.pontuacao}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default TentativasGrid;
