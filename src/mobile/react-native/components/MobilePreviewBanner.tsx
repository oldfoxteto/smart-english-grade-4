import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const MOBILE_PREVIEW_MESSAGE =
  'Mobile app is a Phase 2 preview. The production-ready experience is currently the web platform.';

interface MobilePreviewBannerProps {
  message?: string;
}

const MobilePreviewBanner: React.FC<MobilePreviewBannerProps> = ({ message = MOBILE_PREVIEW_MESSAGE }) => {
  return (
    <View style={styles.banner}>
      <Icon name="info-outline" size={18} color="#7A4B00" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFF3CD',
    borderBottomWidth: 1,
    borderBottomColor: '#F2D58B',
  },
  text: {
    flex: 1,
    fontSize: 12,
    color: '#7A4B00',
    fontWeight: '600',
  },
});

export default MobilePreviewBanner;
