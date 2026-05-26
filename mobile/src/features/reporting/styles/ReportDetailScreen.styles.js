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

  // Banner
  banner: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bannerIcon: {
    fontSize: 72,
    marginBottom: spacing.sm,
  },

  bannerType: {
    fontSize: fonts.sizes.base,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: fonts.weights.semibold,
    textTransform: 'capitalize',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },

  // Photo
  photo: {
    width: '100%',
    height: 220,
  },

  // Content
  content: {
    padding: spacing.screen,
  },

  // Top Row
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },

  dateText: {
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
  },

  // Title
  title: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    lineHeight: 32,
  },

  // Action Buttons
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  editButton: {
    flex: 1,
    backgroundColor: colors.primary + '15',
    padding: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },

  editButtonText: {
    color: colors.primary,
    fontWeight: fonts.weights.semibold,
    fontSize: fonts.sizes.sm,
  },

  shareButton: {
    flex: 1,
    backgroundColor: colors.secondary + '15',
    padding: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.secondary,
  },

  shareButtonText: {
    color: colors.secondary,
    fontWeight: fonts.weights.semibold,
    fontSize: fonts.sizes.sm,
  },

  // Cards
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    ...shadow.sm,
  },

  cardLabel: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Detail Rows
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },

  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  detailIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },

  detailLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
  },

  detailValue: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  description: {
    fontSize: fonts.sizes.base,
    color: colors.textSecondary,
    lineHeight: 24,
  },

  // Report ID
  reportId: {
    textAlign: 'center',
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    marginTop: spacing.md,
  },

});