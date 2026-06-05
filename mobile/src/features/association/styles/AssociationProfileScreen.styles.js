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
    padding: spacing.screen,
    paddingBottom: spacing.xxxl,
  },

  // Header Card
  headerCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadow.md,
  },

  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 3,
    borderColor: colors.white,
  },

  avatarIcon: {
    fontSize: 40,
  },

  associationName: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.extrabold,
    color: colors.white,
    textAlign: 'center',
  },

  associationEmail: {
    fontSize: fonts.sizes.sm,
    color: colors.white,
    opacity: 0.8,
    marginTop: spacing.xs,
  },

  associationZone: {
    fontSize: fonts.sizes.sm,
    color: colors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
  },

  editButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.white,
  },

  editButtonText: {
    color: colors.white,
    fontWeight: fonts.weights.semibold,
    fontSize: fonts.sizes.sm,
  },

  // Mission Card
  missionCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    ...shadow.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  missionText: {
    fontSize: fonts.sizes.base,
    color: colors.textSecondary,
    lineHeight: 24,
    marginTop: spacing.sm,
  },

  // Section Title
  sectionTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  statCard: {
    width: '47%',
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadow.sm,
  },

  statGreen: {
    backgroundColor: colors.primary,
  },

  statBlue: {
    backgroundColor: '#1565C0',
  },

  statOrange: {
    backgroundColor: '#E65100',
  },

  statPurple: {
    backgroundColor: '#6A1B9A',
  },

  statNumber: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.extrabold,
    color: colors.white,
  },

  statLabel: {
    fontSize: fonts.sizes.xs,
    color: colors.white,
    opacity: 0.9,
    marginTop: 2,
    textAlign: 'center',
  },

  // Info Card
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.lg,
    ...shadow.sm,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },

  infoIcon: {
    fontSize: 20,
    marginRight: spacing.md,
    width: 28,
  },

  infoLabel: {
    flex: 1,
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
  },

  infoValue: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  // Achievements
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },

  addButtonText: {
    color: colors.white,
    fontWeight: fonts.weights.bold,
    fontSize: fonts.sizes.sm,
  },

  achievementCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...shadow.sm,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8F00',
  },

  achievementIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },

  achievementInfo: {
    flex: 1,
  },

  achievementTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },

  achievementDescription: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },

  achievementDate: {
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    marginTop: 4,
  },

  // Empty Card
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadow.sm,
  },

  emptyText: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Logout
  logoutButton: {
    backgroundColor: '#FFEBEE',
    borderRadius: radius.lg,
    padding: spacing.base,
    alignItems: 'center',
    marginTop: spacing.lg,
    ...shadow.sm,
  },

  logoutText: {
    color: colors.error,
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
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
    marginBottom: spacing.lg,
  },

  modalLabel: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  modalInput: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
  },

  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },

  // Modal Buttons
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
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

  saveButton: {
    flex: 1,
    padding: spacing.base,
    borderRadius: radius.md,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },

  saveButtonText: {
    color: colors.white,
    fontWeight: fonts.weights.bold,
  },

});