import { StyleSheet } from 'react-native';
import colors from '../../../shared/constants/colors';
import { spacing } from '../../../shared/constants/layout';

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  listContent: {
    padding: spacing.screen,
    paddingTop: spacing.lg,
  },

});