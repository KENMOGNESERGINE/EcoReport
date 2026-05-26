import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import { spacing } from '../../constants/layout';
import fonts from '../../constants/fonts';

export default StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  message: {
    marginTop: spacing.md,
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
  },

});