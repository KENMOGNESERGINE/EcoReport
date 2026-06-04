import { StyleSheet } from 'react-native';
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
    paddingBottom: spacing.xxxl,
  },

  // Avatar Section
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.white,
    marginBottom: spacing.lg,
    ...shadow.sm,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 3,
    borderColor: colors.primary,
  },

  avatarIcon: {
    fontSize: 48,
  },

  userName: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  userEmail: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  roleBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },

  roleText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.primary,
    textTransform: 'capitalize',
  },

  // Menu Section
  menuSection: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.screen,
    borderRadius: radius.lg,
    ...shadow.sm,
    marginBottom: spacing.lg,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
  },

  menuIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },

  menuLabel: {
    flex: 1,
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
    fontWeight: fonts.weights.medium,
  },

  menuArrow: {
    fontSize: fonts.sizes.base,
    color: colors.textLight,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.screen + 24 + spacing.md,
  },

  // Logout
  logoutButton: {
    backgroundColor: '#FFEBEE',
    marginHorizontal: spacing.screen,
    padding: spacing.base,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadow.sm,
  },

  logoutText: {
    color: colors.error,
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
  },

  // Version
  version: {
    textAlign: 'center',
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
  },

});