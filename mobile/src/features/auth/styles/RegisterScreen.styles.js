import { StyleSheet } from 'react-native';
import colors from '../../../shared/constants/colors';
import fonts from '../../../shared/constants/fonts';
import { spacing, radius } from '../../../shared/constants/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.screen,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  backButton: {
    padding: spacing.xs,
  },
  backText: {
    color: colors.white,
    fontSize: fonts.sizes.xl,
  },
  headerTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.white,
  },
  formContainer: {
    padding: spacing.screen,
    paddingTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.base,
    marginTop: spacing.lg,
  },
  inputWrapper: {
    marginBottom: spacing.base,
  },
  inputLabel: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
  },
  showHideText: {
    color: colors.textLight,
    fontSize: fonts.sizes.sm,
    padding: spacing.xs,
  },
  roleContainer: {
    marginBottom: spacing.xl,
  },
  roleLabel: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  roleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    gap: spacing.xs,
  },
  roleChipActive: {
    borderColor: colors.primary,
    backgroundColor: '#E8F5E9',
  },
  roleChipIcon: {
    fontSize: fonts.sizes.base,
  },
  roleChipText: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    fontWeight: fonts.weights.medium,
  },
  roleChipTextActive: {
    color: colors.primary,
    fontWeight: fonts.weights.semibold,
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.base,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: fonts.sizes.sm,
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  },
  registerButtonText: {
    color: colors.white,
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: fonts.sizes.base,
  },
  loginLink: {
    color: colors.primary,
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
  },
});

export default styles;