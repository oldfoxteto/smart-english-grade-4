import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import { CheckCircleOutline, RadioButtonUnchecked } from '@mui/icons-material';
import { useMissions } from '../core/MissionContext';

const DailyMissionsPanel: React.FC = () => {
  const { missions } = useMissions();

  return (
    <Card sx={{ mb: 3, borderRadius: 3, background: 'linear-gradient(135deg, #fdfdfd 0%, #f0f4ff 100%)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          🔥 مهام اليوم
        </Typography>
        <List>
          {missions.map((m) => (
            <ListItem key={m.id} sx={{ py: 1 }}>
              <ListItemIcon>
                {m.completed ? (
                  <CheckCircleOutline sx={{ color: '#4CAF50' }} />
                ) : (
                  <RadioButtonUnchecked sx={{ color: '#9E9E9E' }} />
                )}
              </ListItemIcon>
              <ListItemText
                primary={m.description}
                secondary={m.completed ? 'مكتملة' : `XP +${m.xpReward}`}
              />
              {m.completed && <Chip label="✓" size="small" color="success" />}
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default DailyMissionsPanel;
