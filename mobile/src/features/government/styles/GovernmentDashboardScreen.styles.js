import { StyleSheet } from 'react-native';
import colors from '../../../shared/constants/colors';
import { spacing, radius, shadow } from '../../../shared/constants/layout';
import fonts from '../../../shared/constants/fonts';

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  scrollContent: {
    padding: spacing.screen,
    paddingBottom: spacing.xxxl,
  },

  sectionTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  statCard: {
    width: '47%',
    borderRadius: radius.lg,
    padding: spacing.base,
    alignItems: 'center',
    ...shadow.sm,
  },

  statBlue: {
    backgroundColor: '#1565C0',
  },

  statOrange: {
    backgroundColor: '#E65100',
  },

  statPurple: {
    backgroundColor: '#6A1B9A',
  },

  statGreen: {
    backgroundColor: '#2E7D32',
  },

  statNumber: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: fonts.weights.extrabold,
    color: colors.white,
  },

  statLabel: {
    fontSize: fonts.sizes.xs,
    color: colors.white,
    opacity: 0.9,
    marginTop: 4,
    textAlign: 'center',
  },

  // Citizens Card
  citizensCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    ...shadow.sm,
  },

  citizensIcon: {
    fontSize: 40,
    marginRight: spacing.md,
  },

  citizensNumber: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.extrabold,
    color: '#1565C0',
  },

  citizensLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
  },

  // Actions Grid
  actionsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },

  actionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadow.sm,
    borderTopWidth: 3,
    borderTopColor: '#1565C0',
  },

  actionIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },

  actionLabel: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
  },

  // Hotspots
  hotspotCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...shadow.sm,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6F00',
  },

  hotspotRank: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.extrabold,
    color: '#FF6F00',
    marginRight: spacing.md,
    width: 30,
  },

  hotspotInfo: {
    flex: 1,
  },

  hotspotType: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },

  hotspotCount: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },

  hotspotIcon: {
    fontSize: 24,
  },

});