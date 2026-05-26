import { StyleSheet, Platform, StatusBar } from 'react-native';
import colors from '../../constants/colors';
import { spacing } from '../../constants/layout';
import fonts from '../../constants/fonts';

export default StyleSheet.create({

  container: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'android'
      ? StatusBar.currentHeight + 16
      : 60,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.screen,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  backButton: {
    marginRight: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: spacing.xs,
    borderRadius: 20,
    paddingHorizontal: spacing.sm,
  },

  backText: {
    color: colors.white,
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
  },

  title: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.extrabold,
    color: colors.white,
    letterSpacing: 0.5,
  },

  subtitle: {
    fontSize: fonts.sizes.xs,
    color: colors.white,
    opacity: 0.8,
    marginTop: 2,
  },

  right: {
    marginLeft: spacing.md,
  },

});