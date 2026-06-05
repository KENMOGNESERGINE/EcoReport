import { StyleSheet } from 'react-native';
import colors from '../../../shared/constants/colors';
import { spacing, radius, shadow } from '../../../shared/constants/layout';
import fonts from '../../../shared/constants/fonts';

export default StyleSheet.create({

  container: {
    flex: 1,
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

  statRed: {
    backgroundColor: '#B71C1C',
  },

  statBlue: {
    backgroundColor: '#1565C0',
  },

  statGreen: {
    backgroundColor: '#2E7D32',
  },

  statOrange: {
    backgroundColor: '#E65100',
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

  // Breakdown Card
  breakdownCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    ...shadow.sm,
  },

  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },

  breakdownIcon: {
    fontSize: 24,
    marginRight: spacing.md,
    width: 32,
  },

  breakdownLabel: {
    flex: 1,
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
    fontWeight: fonts.weights.medium,
  },

  breakdownCount: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.extrabold,
    color: '#B71C1C',
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  // Actions Grid
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  actionCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadow.sm,
    borderTopWidth: 3,
    borderTopColor: '#B71C1C',
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

  // Report Stats Card
  reportStatsCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    ...shadow.sm,
  },

  reportStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },

  reportStatLabel: {
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
    fontWeight: fonts.weights.medium,
  },

  reportStatValue: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.extrabold,
    color: '#B71C1C',
  },

});