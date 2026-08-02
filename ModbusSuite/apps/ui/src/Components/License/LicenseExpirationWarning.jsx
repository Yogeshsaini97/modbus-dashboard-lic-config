import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  LinearProgress,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

export const LicenseExpirationWarning = ({
  open,
  onClose,
  licenseInfo,
  daysLeft,
}) => {
  // Determine warning severity based on days left
  const getWarningLevel = () => {
    if (daysLeft <= 7) return 'error';
    if (daysLeft <= 30) return 'warning';
    return 'info';
  };

  const getProgressColor = () => {
    if (daysLeft <= 7) return 'error';
    if (daysLeft <= 30) return 'warning';
    return 'success';
  };

  const getProgressValue = () => {
    // Assume 365 days is 100%
    return Math.min((daysLeft / 365) * 100, 100);
  };

  const getExpirationDate = () => {
    if (licenseInfo?.expiresOn) {
      return new Date(licenseInfo.expiresOn).toLocaleDateString();
    }
    // Calculate expiration date from days left
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysLeft);
    return futureDate.toLocaleDateString();
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
        <InfoIcon />
        License Expiration Information
      </DialogTitle>

      <DialogContent sx={{ mt: 3 }}>
        <Alert severity={getWarningLevel()} sx={{ mb: 3 }}>
          {daysLeft <= 7
            ? '⚠️ Your license will expire very soon! Please renew it.'
            : daysLeft <= 30
            ? '📌 Your license will expire soon. Consider renewing.'
            : '✓ Your license is valid.'}
        </Alert>

        {licenseInfo && (
          <Box sx={{ mb: 3 }}>
            {licenseInfo.product && (
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                <strong>Product:</strong> {licenseInfo.product}
              </Typography>
            )}
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              <strong>Customer:</strong> {licenseInfo.customer}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              <strong>License Type:</strong> {licenseInfo.licenseType}
            </Typography>
            {licenseInfo.issuedOn && (
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                <strong>Issued On:</strong> {new Date(licenseInfo.issuedOn).toLocaleDateString()}
              </Typography>
            )}
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              <strong>Expiration Date:</strong> {getExpirationDate()}
            </Typography>

            <Box sx={{ my: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Time Remaining
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={getProgressValue()}
                color={getProgressColor()}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Box>
        )}

        <Typography variant="body2" color="textSecondary">
          You will be notified when your license is about to expire. To renew or
          update your license, please contact your administrator.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained">
          Understood
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LicenseExpirationWarning;
