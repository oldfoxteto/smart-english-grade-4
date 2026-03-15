import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationService } from '../services';
import { AuthService } from '../services';
import MobilePreviewBanner from '../components/MobilePreviewBanner';

const SettingsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthService.signOut();
              NavigationService.reset('Welcome');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy', 'Privacy policy coming soon!');
  };

  const handleAbout = () => {
    Alert.alert(
      'About',
      'AI English Master\nVersion 1.0.0\n\nLearn English from Zero to Mastery with personalized AI-powered lessons.'
    );
  };

  const handleHelp = () => {
    Alert.alert('Help', 'Help center coming soon!');
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightComponent?: React.ReactNode
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || (
        <Icon name="arrow-forward" size={20} color="#757575" />
      )}
    </TouchableOpacity>
  );

  const renderToggleItem = (
    icon: string,
    title: string,
    subtitle: string,
    value: boolean,
    onToggle: (value: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
        thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <MobilePreviewBanner />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => NavigationService.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#424242" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Account Settings */}
        {renderSection('Account', (
          <>
            {renderSettingItem(
              '👤',
              'Edit Profile',
              'Update your personal information',
              () => Alert.alert('Edit Profile', 'Profile editing coming soon!')
            )}
            {renderSettingItem(
              '🔐',
              'Change Password',
              'Update your password',
              () => Alert.alert('Change Password', 'Password change coming soon!')
            )}
            {renderSettingItem(
              '📧',
              'Email Preferences',
              'Manage email notifications',
              () => Alert.alert('Email Preferences', 'Email preferences coming soon!')
            )}
          </>
        ))}

        {/* Learning Settings */}
        {renderSection('Learning', (
          <>
            {renderToggleItem(
              '🔔',
              'Push Notifications',
              'Get reminders and updates',
              notifications,
              setNotifications
            )}
            {renderToggleItem(
              '🔊',
              'Sound Effects',
              'Play sounds in lessons',
              soundEffects,
              setSoundEffects
            )}
            {renderToggleItem(
              '▶️',
              'Auto-play Audio',
              'Automatically play audio content',
              autoPlay,
              setAutoPlay
            )}
            {renderSettingItem(
              '🎯',
              'Daily Goal',
              'Set your daily learning target',
              () => Alert.alert('Daily Goal', 'Daily goal settings coming soon!')
            )}
          </>
        ))}

        {/* App Settings */}
        {renderSection('App', (
          <>
            {renderSettingItem(
              '🌍',
              'Language',
              selectedLanguage,
              () => Alert.alert('Language', 'Language selection coming soon!'),
              <Text style={styles.settingValue}>{selectedLanguage}</Text>
            )}
            {renderToggleItem(
              '🎨',
              'Dark Mode',
              'Switch to dark theme',
              darkMode,
              setDarkMode
            )}
            {renderSettingItem(
              '📊',
              'Privacy',
              'Manage your privacy settings',
              handlePrivacy
            )}
            {renderSettingItem(
              '❓',
              'Help & Support',
              'Get help and contact support',
              handleHelp
            )}
            {renderSettingItem(
              'ℹ️',
              'About',
              'App version and information',
              handleAbout
            )}
          </>
        ))}

        {/* Storage */}
        {renderSection('Storage', (
          <>
            {renderSettingItem(
              '💾',
              'Clear Cache',
              'Free up storage space',
              () => Alert.alert('Clear Cache', 'Cache clearing coming soon!')
            )}
            {renderSettingItem(
              '📥',
              'Download Settings',
              'Manage offline content',
              () => Alert.alert('Download Settings', 'Download settings coming soon!')
            )}
          </>
        ))}

        {/* Danger Zone */}
        {renderSection('Danger Zone', (
          <>
            {renderSettingItem(
              '🚪',
              'Sign Out',
              'Sign out of your account',
              handleSignOut
            )}
            {renderSettingItem(
              '🗑️',
              'Delete Account',
              'Permanently delete your account',
              () => Alert.alert(
                'Delete Account',
                'This action cannot be undone. Are you sure?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => Alert.alert('Delete Account', 'Account deletion coming soon!'),
                  },
                ]
              )
            )}
          </>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 20,
    backgroundColor: '#4CAF50',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#757575',
  },
  settingValue: {
    fontSize: 12,
    color: '#757575',
  },
});

export default SettingsScreen;
