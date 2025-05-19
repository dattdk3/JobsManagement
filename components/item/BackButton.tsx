import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@ui-kitten/components';

const BackButton: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
      <Text style={[styles.backText, { color: theme['color-primary-500'] }]}>
        ← Quay lại
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    marginBottom: 15,
  },
  backText: {
    fontSize: 22,
  },
});

export default BackButton;
