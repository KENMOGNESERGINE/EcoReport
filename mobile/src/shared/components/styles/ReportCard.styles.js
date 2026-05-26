import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import { spacing, radius, shadow } from '../../constants/layout';
import fonts from '../../constants/fonts';

export default StyleSheet.create({

  container: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    ...shadow.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  icon: {
    fontSize: 24,
  },

  info: {
    flex: 1,
  },

  title: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },

  date: {
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    marginTop: 2,
  },

  description: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },

});