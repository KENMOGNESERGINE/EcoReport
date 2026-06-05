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
    flexGrow: 1,
    paddingBottom: spacing.xxxl,
  },

  // Banner
  banner: {
    backgroundColor: colors.primary,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bannerIcon: {
    fontSize: 64,
    marginBottom: spacing.sm,
  },

  bannerStatus: {
    fontSize: fonts.sizes.sm,
    color: colors.white,
    fontWeight: fonts.weights.semibold,
    textTransform: 'capitalize',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },

  // Content
  content: {
    padding: spacing.screen,
  },

  title: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    lineHeight: 32,
  },

  organization: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  // Details Card
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    ...shadow.sm,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },

  detailIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
    width: 28,
  },

  detailLabel: {
    flex: 1,
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
  },

  detailValue: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  // Progress
  progressContainer: {
    marginBottom: spacing.md,
  },

  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },

  progressText: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'right',
  },

  // Description Card
  descriptionCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    ...shadow.sm,
  },

  descriptionLabel: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  description: {
    fontSize: fonts.sizes.base,
    color: colors.textSecondary,
    lineHeight: 24,
  },

  // Rewards Card
  rewardsCard: {
    backgroundColor: colors.primary + '15',
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  rewardsTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },

  rewardsText: {
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    lineHeight: 20,
    opacity: 0.8,
  },

  // Join Button
  joinButton: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    ...shadow.md,
  },

  joinButtonDisabled: {
    backgroundColor: colors.border,
  },

  joinButtonText: {
    color: colors.white,
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
  },

  // Leave Button
  leaveButton: {
    backgroundColor: colors.error,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    ...shadow.md,
  },

  leaveButtonText: {
    color: colors.white,
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
  },

});