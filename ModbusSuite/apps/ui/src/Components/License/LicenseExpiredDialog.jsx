import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

export const LicenseExpiredDialog = ({
  open,
  onUpload,
  licenseInfo,
  loading,
}) => {
  const getExpirationDate = () => {
    if (licenseInfo?.expiresOn) {
      return new Date(licenseInfo.expiresOn).toLocaleDateString();
    }
    return 'Unknown';
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: '#d32f2f', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
        <ErrorIcon />
        License Expired
      </DialogTitle>

      <DialogContent sx={{ mt: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Your license has expired and needs to be renewed.
        </Alert>

        {licenseInfo && (
          <Box sx={{ mb: 3 }}>
            {licenseInfo.product && (
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                <strong>Product:</strong> {licenseInfo.product}
              </Typography>
            )}
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              <strong>Customer:</strong> {licenseInfo.customer}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              <strong>License Type:</strong> {licenseInfo.licenseType}
            </Typography>
            {licenseInfo.reason && (
              <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                <strong>Validation reason:</strong> {licenseInfo.reason}
              </Typography>
            )}
            {licenseInfo.issuedOn && (
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                <strong>Issued On:</strong> {new Date(licenseInfo.issuedOn).toLocaleDateString()}
              </Typography>
            )}
            {licenseInfo.expiresOn && (
              <Typography variant="body2" color="textSecondary">
                <strong>Expired On:</strong> {new Date(licenseInfo.expiresOn).toLocaleDateString()}
              </Typography>
            )}
            {licenseInfo.machineId && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                  <strong>Machine ID:</strong>
                </Typography>
                <Typography
                  component="code"
                  variant="body2"
                  sx={{
                    display: 'block',
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: 'grey.100',
                    color: 'text.primary',
                    fontFamily: 'monospace',
                    userSelect: 'all',
                    wordBreak: 'break-all',
                  }}
                >
                  {licenseInfo.machineId}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        <Typography variant="body1" sx={{ mb: 2 }}>
          Please upload a new license file to continue using the application.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onUpload}
          variant="contained"
          color="error"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Upload License File'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LicenseExpiredDialog;
