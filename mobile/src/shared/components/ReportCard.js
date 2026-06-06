import React from 'react';
import { View, Text, TouchableOpacity, Image, Share } from 'react-native';
import StatusBadge from './StatusBadge';
import styles from './styles/ReportCard.styles';

const BASE = 'http://93.127.139.4:10051';

const getWasteIcon = (wasteType) => {
  switch (wasteType) {
    case 'plastic':    return '🧴';
    case 'chemical':   return '☣️';
    case 'electronic': return '💻';
    default:           return '🗑️';
  }
};

const getPhotoUrl = (photoUrl) => {
  if (!photoUrl) return null;
  if (photoUrl.startsWith('http')) return photoUrl;
  if (photoUrl.startsWith('data:')) return photoUrl;
  if (photoUrl.length > 200) return null; // corrupted base64 stored directly
  return `${BASE}/uploads/${photoUrl}`;
};

const handleShare = async (report) => {
  const msg = `🗑️ Waste Report: ${report.title}\n📍 Status: ${report.status}\n\n${report.description}`;
  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ title: report.title, text: msg });
    } else if (typeof window !== 'undefined') {
      window.alert('Share this report:\n\n' + msg);
    } else {
      await Share.share({ message: msg });
    }
  } catch (e) {
    console.log('Share cancelled');
  }
};

const ReportCard = ({ report, onPress }) => {
  const photoUri = getPhotoUrl(report.photo_url);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.85}>

      {/* PHOTO or PLACEHOLDER */}
      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={{
            width: '100%', height: 180, borderRadius: 10,
            marginBottom: 10, backgroundColor: '#e0e0e0'
          }}
          resizeMode="cover"
        />
      ) : (
        <View style={{
          width: '100%', height: 90, borderRadius: 10, marginBottom: 10,
          backgroundColor: '#e8f5ee', alignItems: 'center', justifyContent: 'center',
          borderWidth: 1, borderColor: '#c8ddd0', borderStyle: 'dashed'
        }}>
          <Text style={{ fontSize: 32 }}>{getWasteIcon(report.waste_type)}</Text>
          <Text style={{ fontSize: 11, color: '#6b7c72', marginTop: 4 }}>No photo attached</Text>
        </View>
      )}

      {/* TITLE + DATE + STATUS */}
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{report.title}</Text>
          <Text style={styles.date}>{new Date(report.created_at).toLocaleDateString()}</Text>
        </View>
        <StatusBadge status={report.status} />
      </View>

      {/* DESCRIPTION */}
      <Text style={styles.description} numberOfLines={2}>{report.description}</Text>

      {/* SHARE BUTTON */}
      <TouchableOpacity
        onPress={(e) => { e.stopPropagation && e.stopPropagation(); handleShare(report); }}
        style={{
          marginTop: 10, paddingVertical: 8, paddingHorizontal: 14,
          backgroundColor: '#e8f5ee', borderRadius: 8,
          alignSelf: 'flex-start', borderWidth: 1, borderColor: '#c8ddd0'
        }}>
        <Text style={{ color: '#1a7a4a', fontWeight: '700', fontSize: 13 }}>🔗 Share Report</Text>
      </TouchableOpacity>

    </TouchableOpacity>
  );
};

export default ReportCard;