import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView,
  Image, TouchableOpacity
} from 'react-native';
import AppHeader from '../../../shared/components/AppHeader';
import StatusBadge from '../../../shared/components/StatusBadge';
import styles from '../styles/ReportDetailScreen.styles';
import api from '../../../shared/services/api';

const getWasteIcon = (wasteType) => {
  switch (wasteType) {
    case 'plastic': return '🧴';
    case 'chemical': return '☣️';
    case 'electronic': return '💻';
    default: return '🗑️';
  }
};

const getWasteColor = (wasteType) => {
  switch (wasteType) {
    case 'plastic': return '#1976D2';
    case 'chemical': return '#D32F2F';
    case 'electronic': return '#7B1FA2';
    default: return '#388E3C';
  }
};

const ReportDetailScreen = ({ navigation, route }) => {
  const [report, setReport] = useState(route.params.report);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await api.get(`/reports/${route.params.report.id}`);
      setReport(response.data.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Report Detail"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Photo or Banner */}
        {report.photo_url ? (
          <Image
            source={{ uri: report.photo_url }}
            style={styles.photo}
          />
        ) : (
          <View style={[styles.banner, {
            backgroundColor: getWasteColor(report.waste_type)
          }]}>
            <Text style={styles.bannerIcon}>
              {getWasteIcon(report.waste_type)}
            </Text>
            <Text style={styles.bannerType}>
              {report.waste_type} waste
            </Text>
          </View>
        )}

        <View style={styles.content}>

          {/* Status and Date Row */}
          <View style={styles.topRow}>
            <StatusBadge status={report.status} />
            <Text style={styles.dateText}>
              📅 {new Date(report.created_at).toLocaleDateString()}
            </Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{report.title}</Text>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('EditReport', { report })}
            >
              <Text style={styles.editButtonText}>✏️ Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareButtonText}>📤 Share</Text>
            </TouchableOpacity>
          </View>

          {/* Description Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>📝 Description</Text>
            <Text style={styles.description}>{report.description}</Text>
          </View>

          {/* Details Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>📋 Details</Text>

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Text style={styles.detailIcon}>🗑️</Text>
                <Text style={styles.detailLabel}>Waste Type</Text>
              </View>
              <Text style={styles.detailValue}>
                {getWasteIcon(report.waste_type)} {report.waste_type}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Text style={styles.detailIcon}>📍</Text>
                <Text style={styles.detailLabel}>Location</Text>
              </View>
              <Text style={styles.detailValue}>
                {parseFloat(report.latitude).toFixed(4)},
                {parseFloat(report.longitude).toFixed(4)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Text style={styles.detailIcon}>👤</Text>
                <Text style={styles.detailLabel}>Status</Text>
              </View>
              <StatusBadge status={report.status} />
            </View>

          </View>

          {/* Report ID */}
          <Text style={styles.reportId}>
            Report ID: #{report.id}
          </Text>

        </View>
      </ScrollView>
    </View>
  );
};

export default ReportDetailScreen;