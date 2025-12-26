import React from 'react';
import { Card, CardContent, Box, Typography, alpha } from '@mui/material';
import { gradients } from '../theme/theme';

// Modern İstatistik Kartı
export const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'primary',
  gradient = false,
  trend = null, // { value: '+12%', direction: 'up' }
}) => {
  const colorMap = {
    primary: { main: '#6366f1', light: '#e0e7ff' },
    success: { main: '#10b981', light: '#d1fae5' },
    warning: { main: '#f59e0b', light: '#fef3c7' },
    error: { main: '#ef4444', light: '#fee2e2' },
    info: { main: '#3b82f6', light: '#dbeafe' },
    secondary: { main: '#8b5cf6', light: '#ede9fe' },
  };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <Card 
      sx={{ 
        height: '100%',
        background: gradient ? gradients[color] || gradients.primary : 'white',
        color: gradient ? 'white' : 'inherit',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dekoratif daire */}
      <Box
        sx={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: gradient 
            ? 'rgba(255,255,255,0.1)' 
            : alpha(colors.main, 0.1),
        }}
      />
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography 
              variant="overline" 
              color={gradient ? 'rgba(255,255,255,0.8)' : 'text.secondary'}
              sx={{ mb: 0.5, display: 'block' }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h3" 
              fontWeight="bold"
              color={gradient ? 'white' : 'text.primary'}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography 
                variant="caption" 
                color={gradient ? 'rgba(255,255,255,0.7)' : 'text.secondary'}
                sx={{ mt: 0.5, display: 'block' }}
              >
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                <Typography 
                  variant="body2" 
                  fontWeight="bold"
                  color={trend.direction === 'up' ? 'success.main' : 'error.main'}
                  sx={{ 
                    bgcolor: gradient ? 'rgba(255,255,255,0.2)' : alpha(trend.direction === 'up' ? '#10b981' : '#ef4444', 0.1),
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                  }}
                >
                  {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
                </Typography>
              </Box>
            )}
          </Box>
          {Icon && (
            <Box
              sx={{
                bgcolor: gradient ? 'rgba(255,255,255,0.2)' : colors.light,
                borderRadius: 3,
                p: 1.5,
                color: gradient ? 'white' : colors.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon sx={{ fontSize: 32 }} />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

// Modern Progress Kartı
export const ProgressCard = ({ title, value, maxValue, color = 'primary', icon: Icon }) => {
  const percentage = (value / maxValue) * 100;
  
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          {Icon && <Icon color={color} />}
        </Box>
        <Box display="flex" alignItems="baseline" gap={1} mb={1}>
          <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            / {maxValue}
          </Typography>
        </Box>
        <Box sx={{ position: 'relative', height: 8, bgcolor: 'grey.100', borderRadius: 4 }}>
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${Math.min(percentage, 100)}%`,
              bgcolor: `${color}.main`,
              borderRadius: 4,
              transition: 'width 0.5s ease-in-out',
            }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {percentage.toFixed(1)}% tamamlandı
        </Typography>
      </CardContent>
    </Card>
  );
};

// Modern Liste Kartı
export const ListCard = ({ title, items, emptyMessage = 'Veri bulunamadı' }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        {title}
      </Typography>
      {items.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" py={3}>
          {emptyMessage}
        </Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={1}>
          {items.map((item, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'grey.100',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {item.title}
                </Typography>
                {item.subtitle && (
                  <Typography variant="caption" color="text.secondary">
                    {item.subtitle}
                  </Typography>
                )}
              </Box>
              {item.badge && (
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: `${item.badgeColor || 'primary'}.light`,
                    color: `${item.badgeColor || 'primary'}.main`,
                  }}
                >
                  <Typography variant="caption" fontWeight="bold">
                    {item.badge}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
    </CardContent>
  </Card>
);

// Modern Aksiyon Kartı
export const ActionCard = ({ title, description, icon: Icon, color = 'primary', onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      cursor: 'pointer',
      transition: 'all 0.3s',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: (theme) => `0 20px 40px ${alpha(theme.palette[color].main, 0.2)}`,
      },
    }}
  >
    <CardContent>
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: 3,
          background: gradients[color] || gradients.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        {Icon && <Icon sx={{ fontSize: 30, color: 'white' }} />}
      </Box>
      <Typography variant="h6" fontWeight="bold" mb={0.5}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

// Modern Bildirim Kartı
export const NotificationCard = ({ title, message, time, type = 'info', read = false }) => {
  const typeColors = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'error',
  };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: read ? 'transparent' : alpha('#6366f1', 0.05),
        borderLeft: 4,
        borderColor: `${typeColors[type]}.main`,
        transition: 'all 0.2s',
        '&:hover': {
          bgcolor: 'grey.50',
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Typography variant="subtitle2" fontWeight={read ? 400 : 600}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {time}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" mt={0.5}>
        {message}
      </Typography>
    </Box>
  );
};

// Gradient Başlık
export const GradientHeader = ({ title, subtitle }) => (
  <Box
    sx={{
      background: gradients.primary,
      borderRadius: 3,
      p: 4,
      mb: 3,
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Dekoratif şekiller */}
    <Box
      sx={{
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
      }}
    />
    <Box
      sx={{
        position: 'absolute',
        bottom: -30,
        left: '30%',
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
      }}
    />
    <Typography variant="h4" fontWeight="bold" sx={{ position: 'relative', zIndex: 1 }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="body1" sx={{ opacity: 0.9, mt: 1, position: 'relative', zIndex: 1 }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default {
  StatCard,
  ProgressCard,
  ListCard,
  ActionCard,
  NotificationCard,
  GradientHeader,
};
