import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface NavItem {
  id: string;
  label: string;
  route: string;
  iconName: string;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    route: 'Home',
    iconName: 'home',
  },
  {
    id: 'quizzes',
    label: 'Quizzes',
    route: 'Quizzes',
    iconName: 'book',
  },
  {
    id: 'progress',
    label: 'Progress',
    route: 'Progress',
    iconName: 'bar-chart',
  },
  {
    id: 'profile',
    label: 'Profile',
    route: 'Profile',
    iconName: 'person',
  },
  {
    id: 'test',
    label: 'Test',
    route: 'FeatureTest',
    iconName: 'flask',
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

  const renderIcon = (item: NavItem) => {
    const isItemActive = isActive(item);
    
    return (
      <Ionicons
        name={item.iconName as any}
        size={24}
        color={isItemActive ? '#007AFF' : '#666666'}
      />
    );
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
              {renderIcon(item)}
            </View>
            <Text style={[
              styles.label,
              isActive(item) && styles.labelActive,
            ]} numberOfLines={1}>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    flex: 1,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minWidth: 60,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  iconContainerActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'center',
    marginTop: 2,
  },
  labelActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default BottomNav; 