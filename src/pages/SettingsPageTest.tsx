// Test Settings Page - Minimal Version
import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Settings } from '@mui/icons-material';

const SettingsPageTest: React.FC = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        ⚙️ الإعدادات - صفحة اختبار
      </Typography>
      
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            معلومات الملف الشخصي
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            هذه صفحة اختبار بسيطة للتحقق من أن الـ routing يعمل بشكل صحيح.
          </Typography>
          <Button variant="contained" color="primary">
            حفظ الإعدادات
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            الإعدادات الأخرى
          </Typography>
          <Typography variant="body2" color="text.secondary">
            هنا يمكن إضافة المزيد من إعدادات التطبيق.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SettingsPageTest;
