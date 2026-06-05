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

  // Points Card
  pointsCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadow.md,
  },

  pointsNumber: {
    fontSize: 72,
    fontWeight: fonts.weights.extrabold,
    color: colors.white,
  },

  pointsLabel: {
    fontSize: fonts.sizes.base,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.xs,
  },

  badgeText: {
    fontSize: fonts.sizes.xl,
    color: colors.white,
    fontWeight: fonts.weights.bold,
    marginBottom: spacing.md,
  },

  // Available Row
  availableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.md,
    padding: spacing.sm,
  },

  availableText: {
    fontSize: fonts.sizes.sm,
    color: colors.white,
    fontWeight: fonts.weights.semibold,
  },

  spentText: {
    fontSize: fonts.sizes.sm,
    color: colors.white,
    opacity: 0.8,
  },

  // Progress
  progressSection: {
    width: '100%',
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },

  progressLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.white,
    opacity: 0.9,
  },

  progressPoints: {
    fontSize: fonts.sizes.sm,
    color: colors.white,
    opacity: 0.9,
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

  // Catalog Card
  catalogCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...shadow.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  catalogIcon: {
    fontSize: 36,
    marginRight: spacing.md,
  },

  catalogInfo: {
    flex: 1,
  },

  catalogTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },

  catalogDescription: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },

  catalogCost: {
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    fontWeight: fonts.weights.bold,
    marginTop: 4,
  },

  // Redeem Button
  redeemButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    minWidth: 80,
    alignItems: 'center',
  },

  redeemButtonDisabled: {
    backgroundColor: colors.border,
  },

  redeemButtonText: {
    color: colors.white,
    fontWeight: fonts.weights.bold,
    fontSize: fonts.sizes.xs,
  },

  // Redemption Card
  redemptionCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...shadow.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },

  redemptionInfo: {
    flex: 1,
  },

  redemptionType: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },

  redemptionCode: {
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    fontWeight: fonts.weights.bold,
    marginTop: 2,
  },

  redemptionDate: {
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    marginTop: 2,
  },

  redemptionPoints: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.extrabold,
    color: colors.error,
  },

  // Reward Items
  rewardItem: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...shadow.sm,
  },

  rewardIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },

  rewardInfo: {
    flex: 1,
  },

  rewardReason: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    color: colors.textPrimary,
  },

  rewardDate: {
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    marginTop: 2,
  },

  rewardPoints: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.extrabold,
    color: colors.primary,
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
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.extrabold,
    color: colors.primary,
    textAlign: 'right',
  },

  leaderBadge: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'right',
  },

});