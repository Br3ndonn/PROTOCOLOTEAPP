import { IconSymbol } from '@/components/ui/IconSymbol';
import { styles } from '@/styles/FormularioStyles';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { IntercorrenciaData } from './types';

interface IntercorrenciasSectionProps {
  houveIntercorrencia: boolean;
  intercorrencias: IntercorrenciaData[];
  onToggleIntercorrencia: () => void;
  onUpdateIntercorrencia: (intercorrenciaId: string, field: 'selecionada' | 'frequencia' | 'intensidade', value: boolean | number) => void;
}

const IntercorrenciasSection: React.FC<IntercorrenciasSectionProps> = ({
  houveIntercorrencia,
  intercorrencias,
  onToggleIntercorrencia,
  onUpdateIntercorrencia
}) => {
  return (
    <View style={styles.intercorrenciasSection}>
      <Text style={styles.intercorrenciasTitle}>Intercorrências</Text>
      
      {/* Checkbox principal */}
      <TouchableOpacity 
        style={styles.checkboxContainer}
        onPress={onToggleIntercorrencia}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, houveIntercorrencia && styles.checkboxChecked]}>
          {houveIntercorrencia && (
            <IconSymbol name="checkmark" size={16} color="#ffffff" />
          )}
        </View>
        <Text style={styles.checkboxLabel}>Houve intercorrência durante a atividade?</Text>
      </TouchableOpacity>

      {/* Lista de intercorrências */}
      {houveIntercorrencia && (
        <View style={styles.intercorrenciasContainer}>
          <Text style={styles.sectionSubtitle}>
            Selecione as intercorrências e defina frequência e intensidade (1-4):
          </Text>
          
          {intercorrencias.map((intercorrencia) => (
            <View key={intercorrencia.id} style={styles.intercorrenciaItem}>
              {/* Radio button e nome */}
              <TouchableOpacity 
                style={styles.radioContainer}
                onPress={() => onUpdateIntercorrencia(intercorrencia.id, 'selecionada', !intercorrencia.selecionada)}
              >
                <View style={[styles.radio, intercorrencia.selecionada && styles.radioSelected]}>
                  {intercorrencia.selecionada && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.intercorrenciaNome}>{intercorrencia.nome}</Text>
              </TouchableOpacity>

              {/* Campos de frequência e intensidade */}
              {intercorrencia.selecionada && (
                <View style={styles.frequenciaIntensidadeContainer}>
                  {/* Frequência */}
                  <View style={styles.nivelContainer}>
                    <Text style={styles.nivelLabel}>Frequência</Text>
                    <View style={styles.nivelBotoes}>
                      {[1, 2, 3, 4].map((nivel) => (
                        <TouchableOpacity
                          key={nivel}
                          style={[
                            styles.nivelBotao,
                            intercorrencia.frequencia === nivel && styles.nivelBotaoSelected
                          ]}
                          onPress={() => onUpdateIntercorrencia(intercorrencia.id, 'frequencia', nivel)}
                        >
                          <Text style={[
                            styles.nivelTexto,
                            intercorrencia.frequencia === nivel && styles.nivelTextoSelected
                          ]}>
                            {nivel}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Intensidade */}
                  <View style={styles.nivelContainer}>
                    <Text style={styles.nivelLabel}>Intensidade</Text>
                    <View style={styles.nivelBotoes}>
                      {[1, 2, 3, 4].map((nivel) => (
                        <TouchableOpacity
                          key={nivel}
                          style={[
                            styles.nivelBotao,
                            intercorrencia.intensidade === nivel && styles.nivelBotaoSelected
                          ]}
                          onPress={() => onUpdateIntercorrencia(intercorrencia.id, 'intensidade', nivel)}
                        >
                          <Text style={[
                            styles.nivelTexto,
                            intercorrencia.intensidade === nivel && styles.nivelTextoSelected
                          ]}>
                            {nivel}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default IntercorrenciasSection;
