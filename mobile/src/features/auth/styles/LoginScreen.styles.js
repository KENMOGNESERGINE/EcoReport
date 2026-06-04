import { StyleSheet, Platform, StatusBar } from 'react-native';
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
  },

  // Header
  header: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'android'
      ? StatusBar.currentHeight + 40
      : 80,
    paddingBottom: 50,
    paddingHorizontal: spacing.screen,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerIcon: {
    fontSize: 60,
    marginBottom: spacing.sm,
  },

  headerTitle: {
    fontSize: fonts.sizes.display,
    fontWeight: fonts.weights.extrabold,
    color: colors.white,
    letterSpacing: 1,
  },

  headerSubtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.white,
    opacity: 0.8,
    marginTop: spacing.xs,
    textAlign: 'center',
  },

  // Form
  form: {
    padding: spacing.screen,
    marginTop: spacing.lg,
  },

  welcomeText: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
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
    marginBottom: spacing.base,
    color: colors.textPrimary,
    ...shadow.sm,
  },

  // Button
  button: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginBottom: spacing.base,
    marginTop: spacing.sm,
    ...shadow.md,
  },

  buttonDisabled: {
    backgroundColor: colors.border,
  },

  buttonText: {
    color: colors.white,
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    letterSpacing: 0.5,
  },

  // Register link
  registerLink: {
    alignItems: 'center',
    marginTop: spacing.md,
    padding: spacing.sm,
  },

  registerText: {
    color: colors.textSecondary,
    fontSize: fonts.sizes.md,
  },

  registerTextBold: {
    color: colors.primary,
    fontWeight: fonts.weights.bold,
  },

});