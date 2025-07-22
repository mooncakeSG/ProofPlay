import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: '🏠',
    route: 'Home',
  },
  {
    id: 'quizzes',
    label: 'Quizzes',
    icon: '📝',
    route: 'Quizzes',
  },
  {
    id: 'progress',
    label: 'Progress',
    icon: '📊',
    route: 'Progress',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: '👤',
    route: 'Profile',
  },
  {
    id: 'test',
    label: 'Test',
    icon: '🧪',
    route: 'FeatureTest',
  },
];

const BottomNav: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const isActive = (navItem: NavItem) => {
    return route.name === navItem.route;
  };

  const handleNavPress = (navItem: NavItem) => {
    if (!isActive(navItem)) {
      navigation.navigate(navItem.route as never);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Blur Effect */}
      <View style={styles.background} />
      
      {/* Navigation Items */}
      <View style={styles.navContainer}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => handleNavPress(item)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.iconContainer,
              isActive(item) && styles.iconContainerActive,
            ]}>
              <Text style={[
                styles.icon,
                isActive(item) && styles.iconActive,
              ]}>
                {item.icon}
              </Text>
            </View>
            <Text style={[
              styles.label,
              isActive(item) && styles.labelActive,
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    paddingBottom: 20,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  navContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  iconContainerActive: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    fontSize: 24,
    color: '#666',
  },
  iconActive: {
    color: '#ffffff',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  labelActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default BottomNav; 