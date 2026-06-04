import { StyleSheet } from 'react-native';
import { spacing, radius } from '../../constants/layout';
import fonts from '../../constants/fonts';

export default StyleSheet.create({

  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },

  text: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    textTransform: 'capitalize',
  },

});