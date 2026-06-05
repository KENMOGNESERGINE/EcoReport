import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView,
  TouchableOpacity, RefreshControl,
  Alert, ActivityIndicator
} from 'react-native';
import api from '../../../shared/services/api';
import AppHeader from '../../../shared/components/AppHeader';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import styles from '../styles/RewardsScreen.styles';

const RewardsScreen = ({ navigation }) => {
  const [points, setPoints] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [redeeming, setRedeeming] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pointsRes, rewardsRes, catalogRes, leaderRes, redemptionsRes] =
        await Promise.all([
          api.get('/rewards/my-points'),
          api.get('/rewards/my-rewards'),
          api.get('/rewards/catalog'),
          api.get('/rewards/leaderboard'),
          api.get('/rewards/my-redemptions'),
        ]);
      setPoints(pointsRes.data.data);
      setRewards(rewardsRes.data.data);
      setCatalog(catalogRes.data.data);
      setLeaderboard(leaderRes.data.data);
      setRedemptions(redemptionsRes.data.data);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRedeem = async (item) => {
    const available = points?.availablePoints || 0;
    if (available < item.pointsCost) {
      Alert.alert(
        '❌ Not Enough Points!',
        `You need ${item.pointsCost} pts but have ${available} pts!`
      );
      return;
    }
    Alert.alert(
      `Redeem ${item.title}?`,
      `This costs ${item.pointsCost} points. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem!',
          onPress: async () => {
            try {
              setRedeeming(item.type);
              const response = await api.post('/rewards/redeem', {
                rewardType: item.type
              });
              Alert.alert(
                '🎉 Redeemed!',
                `Your code: ${response.data.data.code}\n\nSave this code!`
              );
              fetchData();
            } catch (error) {
              Alert.alert('Error', error.response?.data?.message);
            } finally {
              setRedeeming(null);
            }
          }
        }
      ]
    );
  };

  const getNextBadge = (totalPoints) => {
    if (totalPoints >= 500) return null;
    if (totalPoints >= 200) return { name: '🏆 Champion', needed: 500 };
    if (totalPoints >= 100) return { name: '🥇 Expert', needed: 200 };
    if (totalPoints >= 50) return { name: '🥈 Active', needed: 100 };
    return { name: '🥉 Starter', needed: 50 };
  };

  const getProgress = (totalPoints) => {
    if (totalPoints >= 500) return 100;
    if (totalPoints >= 200) return ((totalPoints - 200) / 300) * 100;
    if (totalPoints >= 100) return ((totalPoints - 100) / 100) * 100;
    if (totalPoints >= 50) return ((totalPoints - 50) / 50) * 100;
    return (totalPoints / 50) * 100;
  };

  if (loading) return <LoadingScreen message="Loading rewards..." />;

  const totalPoints = parseInt(points?.totalPoints) || 0;
  const availablePoints = parseInt(points?.availablePoints) || 0;
  const nextBadge = getNextBadge(totalPoints);
  const progress = getProgress(totalPoints);

  return (
    <View style={styles.container}>
      <AppHeader
        title="🏆 My Rewards"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchData(); }}
            colors={['#2E7D32']}
          />
        }
      >

        {/* Points Card */}
        <View style={styles.pointsCard}>
          <Text style={styles.pointsNumber}>{totalPoints}</Text>
          <Text style={styles.pointsLabel}>Total Points</Text>
          <Text style={styles.badgeText}>{points?.badge}</Text>

          {/* Available Points */}
          <View style={styles.availableRow}>
            <Text style={styles.availableText}>
              Available: {availablePoints} pts
            </Text>
            <Text style={styles.spentText}>
              Spent: {totalPoints - availablePoints} pts
            </Text>
          </View>

          {nextBadge && (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>
                  Next: {nextBadge.name}
                </Text>
                <Text style={styles.progressPoints}>
                  {nextBadge.needed - totalPoints} pts to go
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, {
                  width: `${Math.min(progress, 100)}%`
                }]} />
              </View>
            </View>
          )}
        </View>

        {/* Rewards Catalog */}
        <Text style={styles.sectionTitle}>🎁 Redeem Rewards</Text>
        {catalog.map(item => (
          <View key={item.id} style={styles.catalogCard}>
            <Text style={styles.catalogIcon}>{item.icon}</Text>
            <View style={styles.catalogInfo}>
              <Text style={styles.catalogTitle}>{item.title}</Text>
              <Text style={styles.catalogDescription}>
                {item.description}
              </Text>
              <Text style={styles.catalogCost}>
                🏆 {item.pointsCost} points
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.redeemButton,
                availablePoints < item.pointsCost &&
                styles.redeemButtonDisabled
              ]}
              onPress={() => handleRedeem(item)}
              disabled={
                redeeming === item.type ||
                availablePoints < item.pointsCost
              }
            >
              {redeeming === item.type ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.redeemButtonText}>
                  {availablePoints >= item.pointsCost
                    ? 'Redeem'
                    : 'Need more'
                  }
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ))}

        {/* My Redemptions */}
        {redemptions.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>🎫 My Codes</Text>
            {redemptions.map((item, index) => (
              <View key={index} style={styles.redemptionCard}>
                <View style={styles.redemptionInfo}>
                  <Text style={styles.redemptionType}>
                    {item.reward_type}
                  </Text>
                  <Text style={styles.redemptionCode}>
                    Code: {item.code}
                  </Text>
                  <Text style={styles.redemptionDate}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.redemptionPoints}>
                  -{item.points_spent} pts
                </Text>
              </View>
            ))}
          </>
        )}

        {/* Reward History */}
        {rewards.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>📜 Points History</Text>
            {rewards.map((reward, index) => (
              <View key={index} style={styles.rewardItem}>
                <Text style={styles.rewardIcon}>⭐</Text>
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardReason}>
                    {reward.reason}
                  </Text>
                  <Text style={styles.rewardDate}>
                    {new Date(reward.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.rewardPoints}>
                  +{reward.points} pts
                </Text>
              </View>
            ))}
          </>
        )}

        {/* Leaderboard */}
        <Text style={styles.sectionTitle}>🏆 Leaderboard</Text>
        <View style={styles.leaderboardCard}>
          {leaderboard.map((citizen, index) => (
            <View key={citizen.id} style={styles.leaderRow}>
              <Text style={styles.leaderRank}>
                {index === 0 ? '🥇' :
                 index === 1 ? '🥈' :
                 index === 2 ? '🥉' : `#${index + 1}`}
              </Text>
              <Text style={styles.leaderName}>{citizen.name}</Text>
              <View>
                <Text style={styles.leaderPoints}>
                  {citizen.total_points || 0} pts
                </Text>
                <Text style={styles.leaderBadge}>
                  {citizen.badge}
                </Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
};

export default RewardsScreen;