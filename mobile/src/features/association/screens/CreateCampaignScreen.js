import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator,
  KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import api from '../../../shared/services/api';
import AppHeader from '../../../shared/components/AppHeader';
import styles from '../styles/CreateCampaignScreen.styles';

const CreateCampaignScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('50');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!title || !description || !location || !date) {
      setError('Please fill in all fields!');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await api.post('/campaigns', {
        title,
        description,
        location,
        date,
        maxParticipants: parseInt(maxParticipants),
      });
      Alert.alert(
        '✅ Success!',
        'Campaign created successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setError(
        error.response?.data?.message || 'Failed to create campaign!'
      );
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
        title="➕ New Campaign"
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

          {/* Title */}
          <Text style={styles.label}>Campaign Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Big Yaoundé Cleanup 2026"
            value={title}
            onChangeText={setTitle}
          />

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the campaign goals..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          {/* Location */}
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Melen Market, Yaoundé"
            value={location}
            onChangeText={setLocation}
          />

          {/* Date */}
          <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 2026-06-15"
            value={date}
            onChangeText={setDate}
          />

          {/* Max Participants */}
          <Text style={styles.label}>Max Participants</Text>
          <TextInput
            style={styles.input}
            placeholder="50"
            value={maxParticipants}
            onChangeText={setMaxParticipants}
            keyboardType="numeric"
          />

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              📢 Once created, citizens in your area
              will be notified about this campaign!
            </Text>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled
            ]}
            onPress={handleCreate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>
                📢 Create Campaign
              </Text>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateCampaignScreen;