import { StyleSheet } from 'react-native';
import colors from '../../../shared/constants/colors';
import { spacing, radius, shadow } from '../../../shared/constants/layout';
import fonts from '../../../shared/constants/fonts';

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Create Button
  createButton: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    ...shadow.sm,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },

  createButtonText: {
    color: colors.primary,
    fontWeight: fonts.weights.bold,
    fontSize: fonts.sizes.sm,
  },

  // Filter Tabs
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.sm,
    ...shadow.sm,
  },

  filterTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.full,
  },

  filterTabActive: {
    backgroundColor: colors.primary,
  },

  filterText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.textSecondary,
  },

  filterTextActive: {
    color: colors.white,
  },

  // List
  listContent: {
    padding: spacing.screen,
    paddingBottom: spacing.xxxl,
  },

  // Campaign Card
  campaignCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    ...shadow.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  campaignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  campaignIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },

  campaignInfo: {
    flex: 1,
  },

  campaignTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },

  campaignDate: {
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    marginTop: 2,
  },

  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },

  statusText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    textTransform: 'capitalize',
  },

  campaignLocation: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  // Progress
  progressContainer: {
    marginTop: spacing.xs,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },

  progressLabel: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },

  progressCount: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.primary,
  },

  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },

});