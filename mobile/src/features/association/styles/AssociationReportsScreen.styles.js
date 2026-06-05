import { StyleSheet } from 'react-native';
import colors from '../../../shared/constants/colors';
import { spacing, radius, shadow } from '../../../shared/constants/layout';
import fonts from '../../../shared/constants/fonts';

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
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

  // Report Card
  reportCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    ...shadow.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  reportIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },

  reportInfo: {
    flex: 1,
  },

  reportTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },

  reportReporter: {
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    marginTop: 2,
  },

  reportDate: {
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    marginTop: 2,
  },

  reportDescription: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },

  // Update Button
  updateButton: {
    backgroundColor: colors.primary + '15',
    padding: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },

  updateButtonText: {
    color: colors.primary,
    fontWeight: fonts.weights.semibold,
    fontSize: fonts.sizes.sm,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
  },

  modalTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  modalSubtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  // Status Options
  statusOption: {
    backgroundColor: colors.primary + '10',
    padding: spacing.base,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  statusOptionText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.primary,
  },

  // Cancel Button
  cancelButton: {
    padding: spacing.base,
    alignItems: 'center',
    marginTop: spacing.sm,
  },

  cancelButtonText: {
    fontSize: fonts.sizes.base,
    color: colors.textSecondary,
    fontWeight: fonts.weights.medium,
  },

});