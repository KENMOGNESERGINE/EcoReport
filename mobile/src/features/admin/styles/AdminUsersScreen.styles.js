import { StyleSheet } from 'react-native';
import colors from '../../../shared/constants/colors';
import { spacing, radius, shadow } from '../../../shared/constants/layout';
import fonts from '../../../shared/constants/fonts';

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Search
  searchContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.sm,
    ...shadow.sm,
  },

  searchInput: {
    backgroundColor: colors.background,
    borderRadius: radius.full,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
  },

  // Filter Tabs
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    ...shadow.sm,
  },

  filterTab: {
    flex: 1,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    borderRadius: radius.full,
  },

  filterTabActive: {
    backgroundColor: '#B71C1C',
  },

  filterText: {
    fontSize: 10,
    fontWeight: fonts.weights.semibold,
    color: colors.textSecondary,
  },

  filterTextActive: {
    color: colors.white,
  },

  // List
  listContent: {
    padding: spacing.screen,
    paddingBottom: spacing.xxxl,
  },

  // User Card
  userCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    ...shadow.sm,
    borderLeftWidth: 4,
    borderLeftColor: '#B71C1C',
  },

  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  userAvatarIcon: {
    fontSize: 24,
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },

  userEmail: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },

  userDate: {
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    marginTop: 2,
  },

  roleBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },

  roleText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    textTransform: 'capitalize',
  },

  // User Actions
  userActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  changeRoleButton: {
    flex: 1,
    backgroundColor: '#1565C0' + '15',
    padding: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1565C0',
  },

  changeRoleText: {
    color: '#1565C0',
    fontWeight: fonts.weights.semibold,
    fontSize: fonts.sizes.sm,
  },

  deleteButton: {
    flex: 1,
    backgroundColor: colors.error + '15',
    padding: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error,
  },

  deleteButtonText: {
    color: colors.error,
    fontWeight: fonts.weights.semibold,
    fontSize: fonts.sizes.sm,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
  },

  modalTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  modalSubtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  // Role Options
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },

  roleOptionIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },

  roleOptionText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    textTransform: 'capitalize',
  },

  // Cancel Button
  cancelButton: {
    padding: spacing.base,
    alignItems: 'center',
    marginTop: spacing.sm,
  },

  cancelButtonText: {
    fontSize: fonts.sizes.base,
    color: colors.textSecondary,
    fontWeight: fonts.weights.medium,
  },

});