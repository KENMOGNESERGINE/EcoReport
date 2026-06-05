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

  form: {
    padding: spacing.screen,
  },

  // Error
  errorBox: {
    backgroundColor: '#FFEBEE',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.base,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },

  errorText: {
    color: colors.error,
    fontSize: fonts.sizes.sm,
  },

  // Input
  label: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  input: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.base,
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
    ...shadow.sm,
  },

  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  // Info Box
  infoBox: {
    backgroundColor: colors.primary + '15',
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  infoText: {
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    lineHeight: 20,
  },

  // Submit Button
  submitButton: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginTop: spacing.xl,
    ...shadow.md,
  },

  submitButtonDisabled: {
    backgroundColor: colors.border,
  },

  submitButtonText: {
    color: colors.white,
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
  },

});