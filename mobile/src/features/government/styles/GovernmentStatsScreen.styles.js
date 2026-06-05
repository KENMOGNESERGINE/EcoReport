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

  // Resolution Rate
  rateCard: {
    backgroundColor: '#1565C0',
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadow.md,
  },

  rateNumber: {
    fontSize: 64,
    fontWeight: fonts.weights.extrabold,
    color: colors.white,
  },

  rateLabel: {
    fontSize: fonts.sizes.base,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.md,
  },

  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: radius.full,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.full,
  },

  // Chart
  chartContainer: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
    ...shadow.sm,
  },

  barContainer: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },

  barValue: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginBottom: 4,
  },

  barWrapper: {
    width: '60%',
    height: '70%',
    justifyContent: 'flex-end',
  },

  bar: {
    width: '100%',
    backgroundColor: '#1565C0',
    borderRadius: radius.sm,
    minHeight: 4,
  },

  barLabel: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 4,
  },

  // Waste Types
  wasteCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    ...shadow.sm,
  },

  wasteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  wasteIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
    width: 28,
  },

  wasteType: {
    fontSize: fonts.sizes.sm,
    color: colors.textPrimary,
    textTransform: 'capitalize',
    width: 80,
    fontWeight: fonts.weights.medium,
  },

  wasteBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginHorizontal: spacing.sm,
  },

  wasteBar: {
    height: '100%',
    borderRadius: radius.full,
  },

  wastePct: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    width: 35,
    textAlign: 'right',
  },

  // Leaderboard
  leaderboardCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    ...shadow.sm,
  },

  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  leaderRank: {
    fontSize: fonts.sizes.lg,
    width: 40,
  },

  leaderName: {
    flex: 1,
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
    fontWeight: fonts.weights.medium,
  },

  leaderPoints: {
    fontSize: fonts.sizes.sm,
    color: '#1565C0',
    fontWeight: fonts.weights.bold,
  },

});