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

  sectionTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  statCard: {
    flex: 1,
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

  // Actions Row
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  actionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadow.sm,
    borderTopWidth: 3,
    borderTopColor: colors.primary,
  },

  actionIcon: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },

  actionLabel: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
  },

  // Campaign Card
  campaignCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.sm,
    ...shadow.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },

  campaignTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
    flex: 1,
  },

  campaignDate: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },

  campaignLocation: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },

  campaignParticipants: {
    fontSize: fonts.sizes.xs,
    color: colors.primary,
    fontWeight: fonts.weights.medium,
  },

  // Report Card
  reportCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.sm,
  },

  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  reportTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
    color: colors.textPrimary,
    flex: 1,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    marginLeft: spacing.sm,
  },

  reportDate: {
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
    ...shadow.sm,
  },

  emptyText: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  createButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },

  createButtonText: {
    color: colors.white,
    fontWeight: fonts.weights.bold,
    fontSize: fonts.sizes.sm,
  },

});