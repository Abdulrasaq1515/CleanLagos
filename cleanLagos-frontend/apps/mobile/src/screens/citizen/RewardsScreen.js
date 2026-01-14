import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchUserRewards, 
  redeemReward, 
  addNotification 
} from '../../store';

export default function RewardsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { rewards, isLoading } = useSelector((state) => state.rewards || {});
  
  const [userPoints, setUserPoints] = useState(user?.points || 2450);
  const [selectedReward, setSelectedReward] = useState(null);
  const [redeemModalVisible, setRedeemModalVisible] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemHistory, setRedeemHistory] = useState([]);

  const rewardsCatalog = [
    {
      id: 1,
      name: '₦500 Airtime',
      points: 300,
      description: 'Get ₦500 worth of airtime for any network',
      icon: '📱',
      category: 'Utilities',
      available: true,
      color: '#4CAF50',
    },
    {
      id: 2,
      name: '₦1,000 Airtime',
      points: 500,
      description: 'Get ₦1,000 worth of airtime for any network',
      icon: '📱',
      category: 'Utilities',
      available: true,
      color: '#2196F3',
    },
    {
      id: 3,
      name: 'Movie Ticket',
      points: 400,
      description: 'Cinema movie ticket voucher',
      icon: '🎬',
      category: 'Entertainment',
      available: true,
      color: '#9C27B0',
    },
    {
      id: 4,
      name: 'Restaurant Voucher',
      points: 600,
      description: '₦2,500 restaurant voucher',
      icon: '🍔',
      category: 'Food & Dining',
      available: true,
      color: '#FF9800',
    },
    {
      id: 5,
      name: 'Data Bundle (2GB)',
      points: 450,
      description: '2GB data bundle (1 month validity)',
      icon: '📡',
      category: 'Utilities',
      available: true,
      color: '#00BCD4',
    },
    {
      id: 6,
      name: 'CleanLagos Merch',
      points: 800,
      description: 'Official CleanLagos t-shirt & cap',
      icon: '👕',
      category: 'Merchandise',
      available: true,
      color: '#795548',
    },
    {
      id: 7,
      name: 'Premium Badge',
      points: 1000,
      description: 'Unlock premium features for 90 days',
      icon: '⭐',
      category: 'Premium',
      available: true,
      color: '#FFC107',
    },
    {
      id: 8,
      name: 'Eco-Friendly Kit',
      points: 1500,
      description: 'Complete eco-friendly personal care kit',
      icon: '♻️',
      category: 'Eco-Products',
      available: false,
      color: '#4CAF50',
    },
  ];

  const mockRedeemHistory = [
    {
      id: 1,
      reward: '₦500 Airtime',
      points: 300,
      date: '2024-01-05',
      status: 'completed',
      icon: '📱',
    },
    {
      id: 2,
      reward: 'Movie Ticket',
      points: 400,
      date: '2024-01-03',
      status: 'completed',
      icon: '🎬',
    },
    {
      id: 3,
      reward: 'Data Bundle (2GB)',
      points: 450,
      date: '2024-01-01',
      status: 'completed',
      icon: '📡',
    },
  ];

  useEffect(() => {
    setRedeemHistory(mockRedeemHistory);
    // dispatch(fetchUserRewards());
  }, []);

  const handleRedeem = async () => {
    if (!selectedReward || selectedReward.points > userPoints) {
      return;
    }

    setIsRedeeming(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Deduct points
      setUserPoints(userPoints - selectedReward.points);

      // Add to history
      const newRedemption = {
        id: redeemHistory.length + 1,
        reward: selectedReward.name,
        points: selectedReward.points,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        icon: selectedReward.icon,
      };
      
      setRedeemHistory([newRedemption, ...redeemHistory]);

      dispatch(addNotification({
        type: 'success',
        message: `Successfully redeemed ${selectedReward.name}!`
      }));

      setRedeemModalVisible(false);
      setSelectedReward(null);
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to redeem reward. Please try again.'
      }));
    } finally {
      setIsRedeeming(false);
    }
  };

  const getTierInfo = (points) => {
    if (points < 1000) return { tier: 'Bronze', color: '#CD7F32', next: 1000 };
    if (points < 2500) return { tier: 'Silver', color: '#C0C0C0', next: 2500 };
    if (points < 5000) return { tier: 'Gold', color: '#FFD700', next: 5000 };
    return { tier: 'Platinum', color: '#E5E4E2', next: null };
  };

  const tierInfo = getTierInfo(userPoints);
  const progressPercentage = tierInfo.next ? (userPoints / tierInfo.next) * 100 : 100;

  const renderRewardCard = (reward) => {
    const canAfford = userPoints >= reward.points;
    
    return (
      <TouchableOpacity
        key={reward.id}
        style={[
          styles.rewardCard,
          !reward.available && styles.unavailableCard,
          !canAfford && styles.unaffordableCard
        ]}
        onPress={() => {
          if (reward.available && canAfford) {
            setSelectedReward(reward);
            setRedeemModalVisible(true);
          }
        }}
        disabled={!reward.available || !canAfford}
      >
        <View style={styles.rewardHeader}>
          <Text style={styles.rewardIcon}>{reward.icon}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: reward.color }]}>
            <Text style={styles.categoryText}>{reward.category}</Text>
          </View>
        </View>
        
        <Text style={styles.rewardName}>{reward.name}</Text>
        <Text style={styles.rewardDescription}>{reward.description}</Text>
        
        <View style={styles.rewardFooter}>
          <Text style={[styles.pointsText, { color: canAfford ? '#2E7D32' : '#999' }]}>
            {reward.points} pts
          </Text>
          
          {!reward.available && (
            <View style={styles.comingSoonBadge}>
              <Ionicons name="lock-closed" size={12} color="#999" />
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          )}
          
          {reward.available && !canAfford && (
            <Text style={styles.needMoreText}>
              Need {reward.points - userPoints} more
            </Text>
          )}
          
          {reward.available && canAfford && (
            <View style={styles.canRedeemBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.canRedeemText}>Can Redeem</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderRedeemModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={redeemModalVisible}
      onRequestClose={() => setRedeemModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Confirm Redemption</Text>
            <TouchableOpacity
              onPress={() => setRedeemModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          {selectedReward && (
            <View style={styles.modalBody}>
              <View style={styles.selectedRewardCard}>
                <Text style={styles.selectedRewardIcon}>{selectedReward.icon}</Text>
                <Text style={styles.selectedRewardName}>{selectedReward.name}</Text>
                <Text style={styles.selectedRewardDescription}>{selectedReward.description}</Text>
                
                <View style={styles.pointsBreakdown}>
                  <View style={styles.pointsRow}>
                    <Text style={styles.pointsLabel}>Points Cost:</Text>
                    <Text style={styles.pointsCost}>{selectedReward.points}</Text>
                  </View>
                  <View style={styles.pointsRow}>
                    <Text style={styles.pointsLabel}>Your Points After:</Text>
                    <Text style={styles.pointsAfter}>{userPoints - selectedReward.points}</Text>
                  </View>
                </View>
              </View>
              
              <Text style={styles.confirmationNote}>
                📧 You'll receive confirmation details via email and SMS
              </Text>
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setRedeemModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.confirmButton, isRedeeming && styles.disabledButton]}
                  onPress={handleRedeem}
                  disabled={isRedeeming}
                >
                  {isRedeeming ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.confirmButtonText}>Confirm Redemption</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🎁 Rewards & Points</Text>
          <Text style={styles.subtitle}>Earn points by reporting waste and redeem amazing rewards!</Text>
        </View>

        {/* Points Card */}
        <View style={styles.pointsCard}>
          <View style={styles.pointsHeader}>
            <View>
              <Text style={styles.pointsLabel}>Your Points</Text>
              <Text style={styles.pointsValue}>{userPoints.toLocaleString()}</Text>
            </View>
            <View style={styles.tierBadge}>
              <Text style={[styles.tierText, { color: tierInfo.color }]}>{tierInfo.tier} Tier</Text>
            </View>
          </View>
          
          {tierInfo.next && (
            <View style={styles.progressSection}>
              <Text style={styles.progressLabel}>
                Next Milestone: {tierInfo.next.toLocaleString()} pts
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
              </View>
            </View>
          )}
        </View>

        {/* How to Earn */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 How to Earn Points</Text>
          <View style={styles.earnGrid}>
            <View style={styles.earnCard}>
              <Text style={styles.earnValue}>10</Text>
              <Text style={styles.earnLabel}>Points per report</Text>
            </View>
            <View style={styles.earnCard}>
              <Text style={styles.earnValue}>+5</Text>
              <Text style={styles.earnLabel}>Bonus if verified</Text>
            </View>
            <View style={styles.earnCard}>
              <Text style={styles.earnValue}>+20</Text>
              <Text style={styles.earnLabel}>Bonus if completed</Text>
            </View>
            <View style={styles.earnCard}>
              <Text style={styles.earnValue}>2x</Text>
              <Text style={styles.earnLabel}>Weekend bonus</Text>
            </View>
          </View>
        </View>

        {/* Rewards Catalog */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛍️ Available Rewards</Text>
          <View style={styles.rewardsGrid}>
            {rewardsCatalog.map(renderRewardCard)}
          </View>
        </View>

        {/* Redemption History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📜 Redemption History</Text>
          {redeemHistory.length > 0 ? (
            <View style={styles.historyList}>
              {redeemHistory.map((item, index) => (
                <View key={index} style={styles.historyItem}>
                  <Text style={styles.historyIcon}>{item.icon}</Text>
                  <View style={styles.historyDetails}>
                    <Text style={styles.historyReward}>{item.reward}</Text>
                    <Text style={styles.historyMeta}>
                      {item.date} • {item.points} points • {item.status}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyHistory}>
              <Ionicons name="gift-outline" size={64} color="#ccc" />
              <Text style={styles.emptyHistoryText}>No rewards redeemed yet</Text>
              <Text style={styles.emptyHistorySubtext}>
                Start earning points to get amazing rewards!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {renderRedeemModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  pointsCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: -10,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  pointsLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  tierBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tierText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressSection: {
    marginTop: 10,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 4,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  earnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  earnCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  earnValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  earnLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  rewardCard: {
    width: '47%',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  unavailableCard: {
    opacity: 0.6,
  },
  unaffordableCard: {
    opacity: 0.7,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  rewardIcon: {
    fontSize: 32,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  rewardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  rewardDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    lineHeight: 16,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  comingSoonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  comingSoonText: {
    fontSize: 10,
    color: '#999',
  },
  needMoreText: {
    fontSize: 10,
    color: '#FF9800',
    fontWeight: '600',
  },
  canRedeemBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  canRedeemText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 12,
    gap: 15,
  },
  historyIcon: {
    fontSize: 24,
  },
  historyDetails: {
    flex: 1,
  },
  historyReward: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  historyMeta: {
    fontSize: 12,
    color: '#666',
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyHistoryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 15,
    marginBottom: 8,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: '#AAA',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  selectedRewardCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  selectedRewardIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  selectedRewardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  selectedRewardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  pointsBreakdown: {
    width: '100%',
    gap: 8,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 14,
    color: '#666',
  },
  pointsCost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F44336',
  },
  pointsAfter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  confirmationNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#81C784',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});