import { StyleSheet } from 'react-native';
import colors from '../../../shared/constants/colors';
import { spacing, radius, shadow } from '../../../shared/constants/layout';
import fonts from '../../../shared/constants/fonts';

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Filter Tabs
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.sm,
    ...shadow.sm,
  },

  filterTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.full,
  },

  filterTabActive: {
    backgroundColor: '#1565C0',
  },

  filterText: {
    fontSize: fonts.sizes.xs,
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

  // Report Card
  reportCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    ...shadow.sm,
    borderLeftWidth: 4,
    borderLeftColor: '#1565C0',
  },

  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  reportIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },

  reportInfo: {
    flex: 1,
  },

  reportTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },

  reportReporter: {
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    marginTop: 2,
  },

  reportDescription: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },

  // Assign Button
  assignButton: {
    backgroundColor: '#1565C0' + '15',
    padding: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1565C0',
  },

  assignButtonText: {
    color: '#1565C0',
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
    maxHeight: '80%',
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

  modalLabel: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },

  noAgents: {
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    textAlign: 'center',
    padding: spacing.md,
  },

  // Agent Items
  agentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },

  agentItemSelected: {
    borderColor: '#1565C0',
    backgroundColor: '#1565C0' + '10',
  },

  agentName: {
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
    fontWeight: fonts.weights.medium,
  },

  agentReports: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },

  // Notes Input
  notesInput: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fonts.sizes.base,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: spacing.lg,
  },

  // Modal Buttons
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },

  cancelButton: {
    flex: 1,
    padding: spacing.base,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  cancelButtonText: {
    color: colors.textSecondary,
    fontWeight: fonts.weights.semibold,
  },

  confirmButton: {
    flex: 1,
    padding: spacing.base,
    borderRadius: radius.md,
    alignItems: 'center',
    backgroundColor: '#1565C0',
  },

  confirmButtonDisabled: {
    backgroundColor: colors.border,
  },

  confirmButtonText: {
    color: colors.white,
    fontWeight: fonts.weights.bold,
  },

});