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
      ? StatusBar.currentHeight + 16
      : 60,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.screen,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    marginRight: spacing.md,
  },

  backButtonText: {
    color: colors.white,
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
  },

  headerTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.white,
  },

  // Form
  form: {
    padding: spacing.screen,
  },

  // Error
  errorBox: {
    backgroundColor: '#FFEBEE',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.base,
  },

  errorText: {
    color: colors.error,
    fontSize: fonts.sizes.sm,
  },

  // Input
  label: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },

  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.base,
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
    ...shadow.sm,
  },

  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  // Waste Type
  wasteTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  wasteTypeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },

  wasteTypeSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  wasteTypeText: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    fontWeight: fonts.weights.medium,
  },

  wasteTypeTextSelected: {
    color: colors.white,
    fontWeight: fonts.weights.bold,
  },

  // Photo
  photoButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },

  photoButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadow.sm,
  },

  photoButtonIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },

  photoButtonText: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    fontWeight: fonts.weights.medium,
  },

  photoContainer: {
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadow.sm,
  },

  photo: {
    width: '100%',
    height: 200,
    borderRadius: radius.md,
  },

  removePhotoButton: {
    backgroundColor: colors.error,
    padding: spacing.sm,
    alignItems: 'center',
  },

  removePhotoText: {
    color: colors.white,
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
  },

  // Location
  locationButton: {
    backgroundColor: colors.secondary,
    padding: spacing.base,
    borderRadius: radius.md,
    alignItems: 'center',
    ...shadow.sm,
  },

  locationButtonSuccess: {
    backgroundColor: colors.success,
  },

  locationButtonText: {
    color: colors.white,
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
  },

  locationText: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },

  // Submit
  submitButton: {
    backgroundColor: colors.primary,
    padding: spacing.base,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xxxl,
    ...shadow.md,
  },

  submitButtonDisabled: {
    backgroundColor: colors.border,
  },

  submitButtonText: {
    color: colors.white,
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
  },

});