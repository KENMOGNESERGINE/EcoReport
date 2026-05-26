import { StyleSheet } from 'react-native';
import colors from '../../../shared/constants/colors';
import { spacing, radius, shadow } from '../../../shared/constants/layout';
import fonts from '../../../shared/constants/fonts';

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  listContent: {
    padding: spacing.screen,
    paddingTop: spacing.lg,
  },

  // New Report Button
  newReportButton: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    ...shadow.sm,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },

  newReportButtonText: {
    color: colors.primary,
    fontWeight: fonts.weights.bold,
    fontSize: fonts.sizes.sm,
  },

  // Community Impact
  impactContainer: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.sm,
  },

  impactTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },

  impactText: {
    fontSize: fonts.sizes.sm,
    color: colors.white,
    opacity: 0.9,
    lineHeight: 20,
    marginBottom: spacing.md,
  },

  impactHighlight: {
    fontWeight: fonts.weights.bold,
    color: colors.white,
  },

  impactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  impactStat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },

  impactStatIcon: {
    fontSize: 14,
    marginRight: 4,
  },

  impactStatText: {
    fontSize: fonts.sizes.xs,
    color: colors.white,
    fontWeight: fonts.weights.medium,
  },

  // Section Title
  sectionTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },

});