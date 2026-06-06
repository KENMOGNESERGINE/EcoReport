import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform, Linking, Image
} from 'react-native';

const TEAM = [
  {
    name: 'Njobe Loveline Nkeni',
    role: 'Scrum Master & Backend Developer',
    photo: require('../../../assets/loveline.jpg'),
    color: '#0d4a28',
    email: 'njobelovelinenkeni@gmail.com',
    whatsapp: '237690473882',
    phone: '+237 6 90 47 38 82',
    bio: 'Responsible for backend architecture, VPS deployment on DatabaseMart, Kubernetes orchestration, CI/CD pipeline with Jenkins, and marketplace module development.',
    skills: ['Node.js', 'Docker', 'Kubernetes', 'PostgreSQL', 'Jenkins', 'Ansible'],
  },
  {
    name: 'Kenmogne Matchuekam Sergine Barthe Bres',
    role: 'Product Owner & Frontend Developer',
    photo: require('../../../assets/sergine.jpg'),
    color: '#1565c0',
    email: 'njobelovelinenkeni@gmail.com',
    whatsapp: '237678950512',
    phone: '+237 6 78 95 05 12',
    bio: 'Responsible for product vision, React Native mobile app, waste reporting module, campaigns, role-based navigation and UI/UX design.',
    skills: ['React Native', 'Expo', 'UI/UX', 'Scrum', 'JavaScript'],
  },
];

const openWhatsApp = (number) => Linking.openURL(`https://wa.me/${number}`);
const openEmail   = (email)  => Linking.openURL(`mailto:${email}`);

export default function AboutUsScreen() {
  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>

      <View style={s.header}>
        <Text style={s.logo}>🌿 EcoReport</Text>
        <Text style={s.headerTitle}>About Us</Text>
        <Text style={s.headerSub}>ICT University · SEN3244 Software Architecture · Spring 2026</Text>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Our Mission</Text>
        <Text style={s.sectionText}>
          EcoReport is a full-stack mobile platform solving waste management in Cameroon.
          Citizens report waste with GPS and photos, environmental associations manage
          cleanup campaigns, and government officials monitor city-wide statistics —
          all on one event-driven platform.
        </Text>
        <View style={s.techRow}>
          {['React Native', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'RabbitMQ'].map(t => (
            <View key={t} style={s.techBadge}>
              <Text style={s.techText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={s.teamTitle}>Meet the Team</Text>

      {TEAM.map((m, i) => (
        <View key={i} style={s.card}>
          <View style={s.cardTop}>
            <Image source={m.photo} style={s.avatar} />
            <View style={s.nameBlock}>
              <Text style={s.memberName}>{m.name}</Text>
              <View style={[s.roleBadge, { backgroundColor: m.color + '18', borderColor: m.color + '40' }]}>
                <Text style={[s.roleText, { color: m.color }]}>{m.role}</Text>
              </View>
            </View>
          </View>

          <Text style={s.bio}>{m.bio}</Text>

          <View style={s.skillsRow}>
            {m.skills.map(sk => (
              <View key={sk} style={s.skillBadge}>
                <Text style={s.skillText}>{sk}</Text>
              </View>
            ))}
          </View>

          <View style={s.contactRow}>
            <TouchableOpacity style={s.btnWhatsapp} onPress={() => openWhatsApp(m.whatsapp)}>
              <Text style={s.btnIcon}>💬</Text>
              <View>
                <Text style={s.btnLabel}>WhatsApp</Text>
                <Text style={s.btnSub}>{m.phone}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={s.btnEmail} onPress={() => openEmail(m.email)}>
              <Text style={s.btnIcon}>✉️</Text>
              <View>
                <Text style={[s.btnLabel, { color: '#1565c0' }]}>Email</Text>
                <Text style={[s.btnSub, { color: '#1565c0' }]} numberOfLines={1}>{m.email}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={s.section}>
        <Text style={s.sectionTitle}>Repository</Text>
        <TouchableOpacity style={s.githubBtn}
          onPress={() => Linking.openURL('https://github.com/KENMOGNESERGINE/EcoReport')}>
          <Text style={s.githubText}>🔗 github.com/KENMOGNESERGINE/EcoReport</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.githubBtn, { marginTop: 8, backgroundColor: '#1565c0' }]}
          onPress={() => Linking.openURL('http://93.127.139.4:10051/api/health')}>
          <Text style={s.githubText}>🌐 Live API: 93.127.139.4:10051</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 48 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f5' },

  header: {
    backgroundColor: '#0d4a28',
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logo:        { fontSize: 32, marginBottom: 8 },
  headerTitle: { color: '#7fffc4', fontSize: 28, fontWeight: '800', marginBottom: 6 },
  headerSub:   { color: 'rgba(255,255,255,0.65)', fontSize: 12, textAlign: 'center' },

  section: {
    backgroundColor: '#fff', margin: 14, borderRadius: 14,
    padding: 16, borderWidth: 0.5, borderColor: '#dde5e0',
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1c2620', marginBottom: 8 },
  sectionText:  { fontSize: 13, color: '#4a5a52', lineHeight: 21 },
  techRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  techBadge:    { backgroundColor: '#e8f5ee', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#b8ddc8' },
  techText:     { color: '#1a7a4a', fontSize: 11, fontWeight: '600' },

  teamTitle: { fontSize: 17, fontWeight: '700', color: '#1c2620', marginLeft: 16, marginTop: 4, marginBottom: 4 },

  card: {
    backgroundColor: '#fff', margin: 14, marginTop: 8,
    borderRadius: 16, padding: 16, borderWidth: 0.5, borderColor: '#dde5e0',
  },
  cardTop:   { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar:    { width: 80, height: 80, borderRadius: 40, marginRight: 14, borderWidth: 3, borderColor: '#1a7a4a' },
  nameBlock: { flex: 1 },
  memberName:{ fontSize: 14, fontWeight: '800', color: '#1c2620', marginBottom: 6 },
  roleBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', borderWidth: 1 },
  roleText:  { fontSize: 11, fontWeight: '700' },

  bio: { fontSize: 13, color: '#4a5a52', lineHeight: 20, marginBottom: 12 },

  skillsRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  skillBadge: { backgroundColor: '#f0f4f2', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  skillText:  { color: '#4a5a52', fontSize: 11, fontWeight: '600' },

  contactRow:  { flexDirection: 'row', gap: 10 },
  btnWhatsapp: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#e8f5ee', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#b8ddc8' },
  btnEmail:    { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#e8f0fb', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#b8c8e8' },
  btnIcon:     { fontSize: 20 },
  btnLabel:    { fontSize: 12, fontWeight: '700', color: '#1a7a4a' },
  btnSub:      { fontSize: 10, color: '#1a7a4a', marginTop: 1 },

  githubBtn:  { backgroundColor: '#1c2620', borderRadius: 10, padding: 14, alignItems: 'center' },
  githubText: { color: '#7fffc4', fontWeight: '700', fontSize: 13 },
});