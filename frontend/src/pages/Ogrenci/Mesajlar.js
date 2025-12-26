import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Message, Send, Person, AccessTime } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ogrenciAPI } from '../../services/api';

const Mesajlar = () => {
  const { user, loading: authLoading } = useAuth();
  const [mesajlar, setMesajlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    alici_id: '',
    konu: '',
    icerik: '',
  });

  useEffect(() => {
    if (authLoading) return;
    
    if (user?.ogrenci?.ogrenci_id) {
      fetchMesajlar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const fetchMesajlar = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ogrenciAPI.getMesajlar(user.ogrenci.ogrenci_id);
      setMesajlar(response.data);
    } catch (err) {
      console.error('Mesajlar yükleme hatası:', err);
      setError('Mesajlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setSuccess('');
      await ogrenciAPI.mesajGonder(user.ogrenci.ogrenci_id, formData);
      setSuccess('Mesaj başarıyla gönderildi!');
      setOpenDialog(false);
      setFormData({ alici_id: '', konu: '', icerik: '' });
      fetchMesajlar();
    } catch (err) {
      console.error('Mesaj gönderme hatası:', err);
      setError(err.response?.data?.error || 'Mesaj gönderilirken bir hata oluştu');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Mesajlar
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Send />}
          onClick={() => setOpenDialog(true)}
        >
          Yeni Mesaj
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 3 }}>
        <List>
          {mesajlar.map((mesaj, index) => (
            <React.Fragment key={mesaj.mesaj_id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" fontWeight="bold">
                        {mesaj.konu}
                      </Typography>
                      <Chip 
                        label={mesaj.okundu ? 'Okundu' : 'Yeni'} 
                        color={mesaj.okundu ? 'default' : 'primary'}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography variant="body2" color="text.primary" paragraph>
                        {mesaj.icerik}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="caption" color="text.secondary">
                          Gönderen: {mesaj.gonderen_adi}
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <AccessTime fontSize="small" sx={{ fontSize: 14, mr: 0.5 }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(mesaj.tarih)}
                          </Typography>
                        </Box>
                      </Box>
                    </React.Fragment>
                  }
                />
              </ListItem>
              {index < mesajlar.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>

        {mesajlar.length === 0 && (
          <Box textAlign="center" py={4}>
            <Message sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Henüz mesaj bulunmuyor
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Yeni Mesaj Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Yeni Mesaj Gönder</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Alıcı ID"
              value={formData.alici_id}
              onChange={(e) => setFormData({ ...formData, alici_id: e.target.value })}
              margin="normal"
              required
              type="number"
              helperText="Mesaj göndermek istediğiniz kullanıcının ID'si"
            />
            <TextField
              fullWidth
              label="Konu"
              value={formData.konu}
              onChange={(e) => setFormData({ ...formData, konu: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Mesaj"
              value={formData.icerik}
              onChange={(e) => setFormData({ ...formData, icerik: e.target.value })}
              margin="normal"
              required
              multiline
              rows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>İptal</Button>
            <Button type="submit" variant="contained" startIcon={<Send />}>
              Gönder
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Mesajlar;
