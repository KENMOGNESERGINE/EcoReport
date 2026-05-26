import { StyleSheet, Platform, StatusBar } from 'react-native';
import colors from '../../../shared/constants/colors';
import { spacing, radius, shadow } from '../../../shared/constants/layout';
import fonts from '../../../shared/constants/fonts';

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  loadingText: {
    marginTop: spacing.md,
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
  },

  // Map
  map: {
    flex: 1,
  },

  // Header
  header: {
    position: 'absolute',
    top: Platform.OS === 'android'
      ? StatusBar.currentHeight + 16
      : 60,
    left: spacing.screen,
    right: spacing.screen,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow.md,
  },

  headerTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },

  headerSubtitle: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Marker
  marker: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    ...shadow.sm,
  },

  markerIcon: {
    fontSize: 20,
  },

  // Location Button
  locationButton: {
    position: 'absolute',
    right: spacing.screen,
    bottom: 180,
    width: 50,
    height: 50,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow.md,
  },

  locationButtonText: {
    fontSize: 24,
  },

  // New Report Button
  newReportButton: {
    position: 'absolute',
    bottom: 120,
    left: spacing.screen,
    right: spacing.screen,
    backgroundColor: colors.primary,
    padding: spacing.base,
    borderRadius: radius.lg,
    alignItems: 'center',
    ...shadow.md,
  },

  newReportButtonText: {
    color: colors.white,
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
  },

  // Legend
  legend: {
    position: 'absolute',
    bottom: 170,
    left: spacing.screen,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.sm,
    ...shadow.sm,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    marginRight: spacing.xs,
  },

  legendText: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },

  // Selected Report Card
  selectedCard: {
    position: 'absolute',
    bottom: spacing.xxxl,
    left: spacing.screen,
    right: spacing.screen,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow.md,
  },

  selectedIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },

  selectedInfo: {
    flex: 1,
  },

  selectedTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },

  selectedStatus: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    textTransform: 'capitalize',
    marginTop: 2,
  },

  selectedArrow: {
    fontSize: fonts.sizes.lg,
    color: colors.textLight,
  },

  mapComingSoon: {
  backgroundColor: colors.white,
  margin: spacing.screen,
  borderRadius: radius.lg,
  padding: spacing.xl,
  alignItems: 'center',
  ...shadow.sm,
},

mapIcon: {
  fontSize: 48,
  marginBottom: spacing.sm,
},

mapTitle: {
  fontSize: fonts.sizes.lg,
  fontWeight: fonts.weights.bold,
  color: colors.textPrimary,
},

mapSubtitle: {
  fontSize: fonts.sizes.sm,
  color: colors.textSecondary,
  marginTop: spacing.xs,
},

listContent: {
  paddingHorizontal: spacing.screen,
  paddingBottom: spacing.xl,
},

});