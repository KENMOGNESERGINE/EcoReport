import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles/AppHeader.styles';

const AppHeader = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightComponent,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        )}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? (
            <Text style={styles.subtitle}>{subtitle}</Text>
          ) : null}
        </View>
      </View>
      {rightComponent && (
        <View style={styles.right}>
          {rightComponent}
        </View>
      )}
    </View>
  );
};

export default AppHeader;