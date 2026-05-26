import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import { spacing, radius, shadow } from '../../constants/layout';
import fonts from '../../constants/fonts';

export default StyleSheet.create({

  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: spacing.screen,
    marginTop: -20,
    borderRadius: radius.lg,
    padding: spacing.base,
    ...shadow.md,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.extrabold,
    color: colors.primary,
  },

  pendingNumber: {
    color: colors.statusPending,
  },

  resolvedNumber: {
    color: colors.statusResolved,
  },

  statLabel: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },

  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },

});