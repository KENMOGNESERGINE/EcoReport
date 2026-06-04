import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import { spacing, radius, shadow } from '../../constants/layout';
import fonts from '../../constants/fonts';

export default StyleSheet.create({

  container: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: spacing.xl,
  },

  icon: {
    fontSize: 64,
    marginBottom: spacing.base,
  },

  title: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },

  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    ...shadow.sm,
  },

  buttonText: {
    color: colors.white,
    fontWeight: fonts.weights.bold,
    fontSize: fonts.sizes.sm,
  },

});