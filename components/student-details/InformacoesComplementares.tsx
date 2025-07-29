import React from 'react';
import { View, Text } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { AprendizDisplay } from '@/services/AprendizService';
import { styles } from '@/styles/AlunoDetalhesStyles';

interface InformacoesComplementaresProps {
  aprendiz: AprendizDisplay;
}

export const InformacoesComplementares: React.FC<InformacoesComplementaresProps> = ({ aprendiz }) => {
  return (
    <>
      {/* Informações Familiares */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informações Familiares</Text>
        
        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <IconSymbol name="person.2" size={20} color="#6366f1" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Possui Irmãos</Text>
            <Text style={styles.infoValue}>{aprendiz.irmaos ? 'Sim' : 'Não'}</Text>
          </View>
        </View>
      </View>        

      {/* Part Educação Física */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Participação em Educação Física</Text>
        <Text style={styles.infoValue}>{aprendiz.part_ed_fisica}</Text>
      </View>

      {/* Envolvimento em Exercícios Físicos */}
      { aprendiz.envolvimento_exer_fis && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Envolvimento em Exercícios Físicos</Text>
          <Text style={styles.infoValue}>{aprendiz.envolvimento_exer_fis}</Text>
        </View>
      )}

      {/* Interesses */}
      {aprendiz.interesses && aprendiz.interesses.length > 0 && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Interesses</Text>
          <View style={styles.tagsContainer}>
            {aprendiz.interesses.map((interesse, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{interesse}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Qualidades */}
      {aprendiz.qualidades && aprendiz.qualidades.length > 0 && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Qualidades</Text>
          <View style={styles.tagsContainer}>
            {aprendiz.qualidades.map((qualidade, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{qualidade}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Características que Comprometem a Vida */}
      {aprendiz.caracteristica_compr_vida && aprendiz.caracteristica_compr_vida.length > 0 && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Características que Comprometem a Vida</Text>
          <View style={styles.tagsContainer}>
            {aprendiz.caracteristica_compr_vida.map((caracteristica, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{caracteristica}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Informações de Saúde */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informações de Saúde</Text>
        
        {aprendiz.medicamentos && aprendiz.medicamentos.length > 0 && (
          <>
            <Text style={styles.subsectionTitle}>Medicamentos</Text>
            <View style={styles.tagsContainer}>
              {aprendiz.medicamentos.map((medicamento, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: '#fef3c7' }]}>
                  <Text style={[styles.tagText, { color: '#92400e' }]}>{medicamento}</Text>
                </View>
              ))}
            </View>
          </>
        )}
        
        {aprendiz.qualidade_sono && (
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <IconSymbol name="moon.fill" size={20} color="#6366f1" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Qualidade do Sono</Text>
              <Text style={styles.infoValue}>{aprendiz.qualidade_sono}</Text>
            </View>
          </View>
        )}
        
        {aprendiz.alimentacao && (
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <IconSymbol name="fork.knife" size={20} color="#6366f1" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Alimentação</Text>
              <Text style={styles.infoValue}>{aprendiz.alimentacao}</Text>
            </View>
          </View>
        )}
      </View>
    </>
  );
};
