// PWA Features - Progressive Web App Implementation
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Badge,
  Fab,
  Drawer,
  Paper,
  Switch as MuiSwitch,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  CloudDownload,
  CloudUpload,
  CloudSync,
  CloudOff,
  Wifi,
  WifiOff,
  SignalWifiOff,
  SignalWifi4Bar,
  SignalWifi3Bar,
  SignalWifi2Bar,
  SignalWifi1Bar,
  Storage,
  Sync,
  SyncProblem,
  SyncDisabled,
  Update,
  SystemUpdate,
  SystemUpdateAlt,
  Download,
  Upload,
  Refresh,
  Settings,
  Notifications,
  NotificationsOff,
  NotificationsActive,
  NotificationsPaused,
  NotificationsNone,
  PhoneAndroid,
  TabletAndroid,
  DesktopWindows,
  Laptop,
  Tv,
  Watch,
  Devices,
  DevicesOther,
  ImportantDevices,
  DeviceHub,
  Memory,
  SdStorage,
  Usb,
  Bluetooth,
  BluetoothDisabled,
  BluetoothSearching,
  BluetoothConnected,
  NetworkCheck,
  NetworkLocked,
  NetworkPing,
  NetworkWifi,
  NetworkWifi1Bar,
  NetworkWifi2Bar,
  NetworkWifi3Bar,
  NetworkWifi4Bar,
  DataUsage,
  DataSaverOn,
  DataSaverOff,
  DataArray,
  DataObject,
  DataThresholding,
  DataExploration,
  OfflineBolt,
  OfflinePin,
  OfflineShare,
  Cached,
  Cache,
  CloudQueue,
  CloudDone,
  CloudCircle,
  CloudSync as CloudSyncIcon,
  SettingsEthernet,
  SettingsInputComponent,
  SettingsInputHdmi,
  SettingsInputAntenna,
  SettingsBluetooth,
  SettingsApplications,
  SettingsSystemDaydream,
  SettingsOverscan,
  SettingsPhone,
  SettingsRemote,
  SettingsInputComposite,
  SettingsInputSvideo,
  SettingsVoice,
  SettingsInputComponent as ComponentSettings,
  SettingsInputHdmi as HdmiSettings,
  SettingsInputAntenna as AntennaSettings,
  SettingsBluetooth as BluetoothSettings,
  SettingsApplications as AppSettings,
  SettingsSystemDaydream as DaydreamSettings,
  SettingsOverscan as OverscanSettings,
  SettingsPhone as PhoneSettings,
  SettingsRemote as RemoteSettings,
  SettingsInputComposite as CompositeSettings,
  SettingsInputSvideo as SvideoSettings,
  SettingsVoice as VoiceSettings,
  SettingsEthernet as EthernetSettings,
} from '@mui/icons-material';

// PWA Service Worker Manager
interface ServiceWorkerStatus {
  supported: boolean;
  enabled: boolean;
  installing: boolean;
  waiting: boolean;
  active: boolean;
  error: string | null;
  version: string;
  lastUpdateCheck: Date;
}

interface OfflineData {
  lessons: any[];
  exercises: any[];
  vocabulary: any[];
  grammar: any[];
  achievements: any[];
  userProgress: any;
  settings: any;
  lastSync: Date;
  size: number;
}

interface NetworkStatus {
  online: boolean;
  type: 'wifi' | 'cellular' | 'ethernet' | 'bluetooth' | 'unknown';
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface StorageQuota {
  used: number;
  available: number;
  quota: number;
  percentage: number;
}

interface PWAFeatures {
  installable: boolean;
  installed: boolean;
  standalone: boolean;
  beforeInstallPrompt: any;
  deferredPrompt: any;
}

const PWAFeatures: React.FC = () => {
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<ServiceWorkerStatus>({
    supported: false,
    enabled: false,
    installing: false,
    waiting: false,
    active: false,
    error: null,
    version: '1.0.0',
    lastUpdateCheck: new Date(),
  });

  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    online: navigator.onLine,
    type: 'unknown',
    effectiveType: '4g',
    downlink: 0,
    rtt: 0,
    saveData: false,
  });

  const [storageQuota, setStorageQuota] = useState<StorageQuota>({
    used: 0,
    available: 0,
    quota: 0,
    percentage: 0,
  });

  const [offlineData, setOfflineData] = useState<OfflineData>({
    lessons: [],
    exercises: [],
    vocabulary: [],
    grammar: [],
    achievements: [],
    userProgress: null,
    settings: null,
    lastSync: new Date(),
    size: 0,
  });

  const [pwaFeatures, setPWAFeatures] = useState<PWAFeatures>({
    installable: false,
    installed: false,
    standalone: false,
    beforeInstallPrompt: null,
    deferredPrompt: null,
  });

  const [settings, setSettings] = useState({
    offlineMode: false,
    autoSync: true,
    syncInterval: 30, // minutes
    cacheSize: 100, // MB
    notifications: true,
    backgroundSync: true,
    prefetchLessons: true,
    prefetchExercises: true,
    compressData: true,
    encryption: false,
  });

  const [syncStatus, setSyncStatus] = useState({
    syncing: false,
    lastSync: new Date(),
    pendingChanges: 0,
    conflicts: 0,
  });

  const [notifications, setNotifications] = useState({
    enabled: true,
    permission: 'default' as NotificationPermission,
    subscription: null,
  });

  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStorageDialog, setShowStorageDialog] = useState(false);
  const [showSyncDialog, setShowSyncDialog] = useState(false);

  // Initialize Service Worker
  useEffect(() => {
    const initServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          
          setServiceWorkerStatus(prev => ({
            ...prev,
            supported: true,
            enabled: true,
            active: !!registration.active,
            version: registration.active?.scriptURL?.split('/').pop() || '1.0.0',
          }));

          // Listen for service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setServiceWorkerStatus(prev => ({
                    ...prev,
                    waiting: true,
                  }));
                }
              });
            }
          });

          // Listen for controller changes
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
          });

        } catch (error) {
          setServiceWorkerStatus(prev => ({
            ...prev,
            supported: true,
            enabled: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          }));
        }
      } else {
        setServiceWorkerStatus(prev => ({
          ...prev,
          supported: false,
          enabled: false,
        }));
      }
    };

    initServiceWorker();
  }, []);

  // Initialize Network Status
  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      setNetworkStatus({
        online: navigator.onLine,
        type: connection?.type || 'unknown',
        effectiveType: connection?.effectiveType || '4g',
        downlink: connection?.downlink || 0,
        rtt: connection?.rtt || 0,
        saveData: connection?.saveData || false,
      });
    };

    updateNetworkStatus();

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      if ((navigator as any).connection) {
        (navigator as any).connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  // Initialize Storage Quota
  useEffect(() => {
    const updateStorageQuota = async () => {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
          const estimate = await navigator.storage.estimate();
          const used = estimate.usage || 0;
          const quota = estimate.quota || 0;
          const available = quota - used;
          const percentage = quota > 0 ? (used / quota) * 100 : 0;

          setStorageQuota({
            used,
            available,
            quota,
            percentage,
          });
        } catch (error) {
          console.error('Error estimating storage:', error);
        }
      }
    };

    updateStorageQuota();
    
    // Update storage quota periodically
    const interval = setInterval(updateStorageQuota, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Initialize PWA Features
  useEffect(() => {
    const checkPWAFeatures = () => {
      // Check if app is installable
      const isInstallable = 'beforeinstallprompt' in window;
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      
      setPWAFeatures(prev => ({
        ...prev,
        installable: isInstallable,
        installed: isStandalone,
        standalone: isStandalone,
      }));

      // Listen for beforeinstallprompt event
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setPWAFeatures(prev => ({
          ...prev,
          beforeInstallPrompt: e,
          deferredPrompt: e,
        }));
        setShowInstallPrompt(true);
      });
    };

    checkPWAFeatures();
  }, []);

  // Initialize Notifications
  useEffect(() => {
    const initNotifications = async () => {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        setNotifications(prev => ({
          ...prev,
          permission,
          enabled: permission === 'granted',
        }));
      }
    };

    if (settings.notifications) {
      initNotifications();
    }
  }, [settings.notifications]);

  // Handle Install Prompt
  const handleInstall = async () => {
    if (pwaFeatures.deferredPrompt) {
      try {
        await pwaFeatures.deferredPrompt.prompt();
        const { outcome } = await pwaFeatures.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          setPWAFeatures(prev => ({
            ...prev,
            installed: true,
          }));
          setShowInstallPrompt(false);
        }
        
        setPWAFeatures(prev => ({
          ...prev,
          deferredPrompt: null,
        }));
      } catch (error) {
        console.error('Error during install:', error);
      }
    }
  };

  // Handle Sync
  const handleSync = async () => {
    setSyncStatus(prev => ({
      ...prev,
      syncing: true,
    }));

    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSyncStatus(prev => ({
        ...prev,
        syncing: false,
        lastSync: new Date(),
        pendingChanges: 0,
        conflicts: 0,
      }));
      
      setOfflineData(prev => ({
        ...prev,
        lastSync: new Date(),
      }));
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        syncing: false,
      }));
      console.error('Sync error:', error);
    }
  };

  // Handle Offline Mode Toggle
  const handleOfflineModeToggle = (enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      offlineMode: enabled,
    }));
  };

  // Handle Cache Clear
  const handleClearCache = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        
        setStorageQuota(prev => ({
          ...prev,
          used: 0,
          percentage: 0,
        }));
        
        setOfflineData({
          lessons: [],
          exercises: [],
          vocabulary: [],
          grammar: [],
          achievements: [],
          userProgress: null,
          settings: null,
          lastSync: new Date(),
          size: 0,
        });
      } catch (error) {
        console.error('Error clearing cache:', error);
      }
    }
  };

  // Get Network Icon
  const getNetworkIcon = () => {
    if (!networkStatus.online) return <SignalWifiOff />;
    
    switch (networkStatus.effectiveType) {
      case 'slow-2g':
      case '2g':
        return <SignalWifi1Bar />;
      case '3g':
        return <SignalWifi2Bar />;
      case '4g':
        return <SignalWifi4Bar />;
      default:
        return <SignalWifi3Bar />;
    }
  };

  // Get Storage Color
  const getStorageColor = () => {
    if (storageQuota.percentage > 80) return 'error';
    if (storageQuota.percentage > 60) return 'warning';
    return 'success';
  };

  // Format Storage Size
  const formatStorageSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Header */}
      <Paper sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            📱 PWA Features
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Settings">
              <IconButton onClick={() => setShowSettings(true)}>
                <Settings />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Status Cards */}
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {/* Service Worker Status */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Service Worker</Typography>
                  <Avatar sx={{ bgcolor: serviceWorkerStatus.active ? 'success.main' : 'error.main' }}>
                    {serviceWorkerStatus.active ? <CloudDone /> : <CloudOff />}
                  </Avatar>
                </Box>
                
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Status: {serviceWorkerStatus.active ? 'Active' : 'Inactive'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Version: {serviceWorkerStatus.version}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supported: {serviceWorkerStatus.supported ? 'Yes' : 'No'}
                  </Typography>
                </Box>
                
                {serviceWorkerStatus.waiting && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    <AlertTitle>Update Available</AlertTitle>
                    A new version is ready to install.
                    <Button size="small" onClick={() => window.location.reload()}>
                      Update Now
                    </Button>
                  </Alert>
                )}
                
                {serviceWorkerStatus.error && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    <AlertTitle>Error</AlertTitle>
                    {serviceWorkerStatus.error}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Network Status */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Network</Typography>
                  <Avatar sx={{ bgcolor: networkStatus.online ? 'success.main' : 'error.main' }}>
                    {getNetworkIcon()}
                  </Avatar>
                </Box>
                
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Status: {networkStatus.online ? 'Online' : 'Offline'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {networkStatus.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Speed: {networkStatus.effectiveType}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Downlink: {networkStatus.downlink} Mbps
                  </Typography>
                </Box>
                
                {!networkStatus.online && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    <AlertTitle>Offline Mode</AlertTitle>
                    Some features may be limited.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Storage Status */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Storage</Typography>
                  <Avatar sx={{ bgcolor: getStorageColor() as any }}>
                    <Storage />
                  </Avatar>
                </Box>
                
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Used: {formatStorageSize(storageQuota.used)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available: {formatStorageSize(storageQuota.available)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total: {formatStorageSize(storageQuota.quota)}
                  </Typography>
                </Box>
                
                <LinearProgress
                  variant="determinate"
                  value={storageQuota.percentage}
                  color={getStorageColor() as any}
                  sx={{ mt: 1 }}
                />
                
                <Typography variant="caption" color="text.secondary">
                  {storageQuota.percentage.toFixed(1)}% used
                </Typography>
                
                <Box sx={{ mt: 1 }}>
                  <Button size="small" onClick={() => setShowStorageDialog(true)}>
                    Manage Storage
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* PWA Status */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">PWA Status</Typography>
                  <Avatar sx={{ bgcolor: pwaFeatures.installed ? 'success.main' : 'info.main' }}>
                    {pwaFeatures.installed ? <PhoneAndroid /> : <CloudDownload />}
                  </Avatar>
                </Box>
                
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Installable: {pwaFeatures.installable ? 'Yes' : 'No'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Installed: {pwaFeatures.installed ? 'Yes' : 'No'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Standalone: {pwaFeatures.standalone ? 'Yes' : 'No'}
                  </Typography>
                </Box>
                
                {showInstallPrompt && !pwaFeatures.installed && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    <AlertTitle>Install App</AlertTitle>
                    <Button size="small" onClick={handleInstall}>
                      Install
                    </Button>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Features List */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          🚀 PWA Features
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Offline Capabilities
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <OfflineBolt />
                    </ListItemIcon>
                    <ListItemText
                      primary="Offline Mode"
                      secondary="Access lessons and exercises without internet"
                    />
                    <MuiSwitch
                      checked={settings.offlineMode}
                      onChange={(e) => handleOfflineModeToggle(e.target.checked)}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Cached />
                    </ListItemIcon>
                    <ListItemText
                      primary="Smart Caching"
                      secondary="Automatically cache important content"
                    />
                    <MuiSwitch
                      checked={settings.autoSync}
                      onChange={(e) => setSettings(prev => ({ ...prev, autoSync: e.target.checked }))}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <CloudSync />
                    </ListItemIcon>
                    <ListItemText
                      primary="Background Sync"
                      secondary="Sync data when connection is available"
                    />
                    <MuiSwitch
                      checked={settings.backgroundSync}
                      onChange={(e) => setSettings(prev => ({ ...prev, backgroundSync: e.target.checked }))}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  App Experience
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Notifications />
                    </ListItemIcon>
                    <ListItemText
                      primary="Push Notifications"
                      secondary="Get notified about updates and achievements"
                    />
                    <MuiSwitch
                      checked={settings.notifications}
                      onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Devices />
                    </ListItemIcon>
                    <ListItemText
                      primary="Cross-Platform"
                      secondary="Works on mobile, tablet, and desktop"
                    />
                    <Chip label="Available" color="success" size="small" />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Speed />
                    </ListItemIcon>
                    <ListItemText
                      primary="Fast Loading"
                      secondary="Instant app start with service worker"
                    />
                    <Chip label="Optimized" color="success" size="small" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Sync Status */}
      <Box sx={{ p: 2 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Sync Status
              </Typography>
              <Button
                variant="contained"
                onClick={handleSync}
                disabled={syncStatus.syncing}
                startIcon={syncStatus.syncing ? <CircularProgress size={20} /> : <Sync />}
              >
                {syncStatus.syncing ? 'Syncing...' : 'Sync Now'}
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Chip
                label={`Last Sync: ${syncStatus.lastSync.toLocaleString()}`}
                variant="outlined"
                size="small"
              />
              {syncStatus.pendingChanges > 0 && (
                <Chip
                  label={`${syncStatus.pendingChanges} Pending Changes`}
                  color="warning"
                  size="small"
                />
              )}
              {syncStatus.conflicts > 0 && (
                <Chip
                  label={`${syncStatus.conflicts} Conflicts`}
                  color="error"
                  size="small"
                />
              )}
            </Box>
            
            <LinearProgress
              variant="determinate"
              value={syncStatus.syncing ? 50 : 100}
              sx={{ mb: 1 }}
            />
          </CardContent>
        </Card>
      </Box>

      {/* Settings Drawer */}
      <Drawer
        anchor="right"
        open={showSettings}
        onClose={() => setShowSettings(false)}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            PWA Settings
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText
                primary="Auto Sync"
                secondary="Automatically sync data"
              />
              <MuiSwitch
                checked={settings.autoSync}
                onChange={(e) => setSettings(prev => ({ ...prev, autoSync: e.target.checked }))}
              />
            </ListItem>
            
            <ListItem>
              <ListItemText
                primary="Sync Interval"
                secondary="How often to sync (minutes)"
              />
              <Slider
                value={settings.syncInterval}
                onChange={(e, value) => setSettings(prev => ({ ...prev, syncInterval: value as number }))}
                min={5}
                max={120}
                step={5}
                marks={[
                  { value: 5, label: '5m' },
                  { value: 30, label: '30m' },
                  { value: 60, label: '1h' },
                  { value: 120, label: '2h' },
                ]}
              />
            </ListItem>
            
            <ListItem>
              <ListItemText
                primary="Cache Size"
                secondary="Maximum cache size (MB)"
              />
              <Slider
                value={settings.cacheSize}
                onChange={(e, value) => setSettings(prev => ({ ...prev, cacheSize: value as number }))}
                min={10}
                max={500}
                step={10}
                marks={[
                  { value: 10, label: '10MB' },
                  { value: 100, label: '100MB' },
                  { value: 250, label: '250MB' },
                  { value: 500, label: '500MB' },
                ]}
              />
            </ListItem>
            
            <ListItem>
              <ListItemText
                primary="Prefetch Lessons"
                secondary="Download lessons for offline use"
              />
              <MuiSwitch
                checked={settings.prefetchLessons}
                onChange={(e) => setSettings(prev => ({ ...prev, prefetchLessons: e.target.checked }))}
              />
            </ListItem>
            
            <ListItem>
              <ListItemText
                primary="Prefetch Exercises"
                secondary="Download exercises for offline use"
              />
              <MuiSwitch
                checked={settings.prefetchExercises}
                onChange={(e) => setSettings(prev => ({ ...prev, prefetchExercises: e.target.checked }))}
              />
            </ListItem>
            
            <ListItem>
              <ListItemText
                primary="Compress Data"
                secondary="Compress cached data to save space"
              />
              <MuiSwitch
                checked={settings.compressData}
                onChange={(e) => setSettings(prev => ({ ...prev, compressData: e.target.checked }))}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Storage Dialog */}
      <Dialog open={showStorageDialog} onClose={() => setShowStorageDialog(false)}>
        <DialogTitle>Storage Management</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Manage your offline storage and cached data.
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Current Usage</Typography>
            <LinearProgress
              variant="determinate"
              value={storageQuota.percentage}
              color={getStorageColor() as any}
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {formatStorageSize(storageQuota.used)} of {formatStorageSize(storageQuota.quota)} used
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Cached Content</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Lessons" secondary={`${offlineData.lessons.length} items`} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Exercises" secondary={`${offlineData.exercises.length} items`} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Vocabulary" secondary={`${offlineData.vocabulary.length} words`} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Grammar Rules" secondary={`${offlineData.grammar.length} rules`} />
              </ListItem>
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStorageDialog(false)}>Cancel</Button>
          <Button onClick={handleClearCache} color="error">
            Clear Cache
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PWAFeatures;
