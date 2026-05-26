import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator,
  KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import api from '../../../shared/services/api';
import AppHeader from '../../../shared/components/AppHeader';
import styles from '../styles/NewReportScreen.styles';

const WASTE_TYPES = [
  { label: '🧴 Plastic', value: 'plastic' },
  { label: '☣️ Chemical', value: 'chemical' },
  { label: '💻 Electronic', value: 'electronic' },
  { label: '🗑️ Other', value: 'other' },
];

const EditReportScreen = ({ navigation, route }) => {
  const { report } = route.params;
  const [title, setTitle] = useState(report.title);
  const [description, setDescription] = useState(report.description);
  const [wasteType, setWasteType] = useState(report.waste_type || 'other');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    if (!title || !description) {
      setError('Please fill in title and description!');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await api.put(`/reports/${report.id}`, {
        title,
        description,
        wasteType,
      });
      Alert.alert(
        '✅ Success!',
        'Report updated successfully!',
        [{ text: 'OK', onPress: () => {
  navigation.goBack();
}}]
      );
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AppHeader
        title="Edit Report ✏️"
        showBack={true}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Waste Type</Text>
          <View style={styles.wasteTypeContainer}>
            {WASTE_TYPES.map(type => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.wasteTypeButton,
                  wasteType === type.value && styles.wasteTypeSelected
                ]}
                onPress={() => setWasteType(type.value)}
              >
                <Text style={[
                  styles.wasteTypeText,
                  wasteType === type.value && styles.wasteTypeTextSelected
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>✏️ Update Report</Text>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditReportScreen;