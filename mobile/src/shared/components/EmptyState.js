import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles/EmptyState.styles';

const EmptyState = ({
  icon = '🗑️',
  title = 'Nothing here!',
  subtitle = '',
  buttonText,
  onButtonPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? (
        <Text style={styles.subtitle}>{subtitle}</Text>
      ) : null}
      {buttonText && onButtonPress ? (
        <TouchableOpacity
          style={styles.button}
          onPress={onButtonPress}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default EmptyState;