import { useState, useEffect } from 'react';

export const useLicenseCheck = () => {
  const [licenseStatus, setLicenseStatus] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [showExpiredDialog, setShowExpiredDialog] = useState(false);
  const [showExpirationWarning, setShowExpirationWarning] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const [licenseInfo, setLicenseInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLicense = async () => {
      try {
        console.log('[License Check] Starting license check...');
        
        if (!window.licenseAPI) {
          console.warn('[License Check] License API not available (non-Electron environment)');
          setLoading(false);
          return;
        }

        console.log('[License Check] Calling getLicenseStatus...');
        const status = await window.licenseAPI.getLicenseStatus();
        console.log('[License Check] License status received:', status);
        
        setLicenseStatus(status);

        if (!status) {
          console.log('[License Check] No status returned');
          setLoading(false);
          return;
        }

        // Handle TRIAL mode
        if (status.licenseType === 'TRIAL') {
          console.log('[License Check] Running in TRIAL mode, days remaining:', status.remainingDays);
          setLicenseInfo({
            customer: 'Trial User',
            licenseType: 'TRIAL',
            remainingDays: status.remainingDays,
            machineId: status.machineId,
          });

          if (status.expired) {
            console.log('[License Check] Trial has EXPIRED');
            setIsExpired(true);
            setShowExpiredDialog(true);
          } else {
            console.log('[License Check] Trial is VALID, days left:', status.remainingDays);
            setDaysLeft(status.remainingDays);
            if (status.remainingDays <= 7) {
              setShowExpirationWarning(true);
            }
          }
        }
        else if (status.licenseType === 'INVALID') {
          console.warn('[License Check] Installed license is invalid:', status.reason);
          setLicenseInfo({
            customer: 'License validation failed',
            licenseType: 'INVALID',
            machineId: status.machineId,
            reason: status.reason,
          });
          setIsExpired(true);
          setShowExpiredDialog(true);
        }
        else if (status && (status.licenseType === 'LICENSE' || status.licenseType)) {
          console.log('[License Check] Running in LICENSE mode');
          
          // For licenses with remainingDays or expiresOn
          if (status.remainingDays !== undefined || status.expiresOn) {
            let daysRemaining = status.remainingDays;
            
            // Calculate remaining days from expiresOn if not provided
            if (daysRemaining == null && status.expiresOn) {
              const expiresOn = new Date(status.expiresOn);
              const now = new Date();
              const timeDiff = expiresOn - now;
              daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            }

            console.log('[License Check] License days remaining:', daysRemaining);
            setLicenseInfo({
              product: status.product || 'Modbus Dashboard',
              customer: status.customer || 'Licensed User',
              licenseType: status.licenseType,
              issuedOn: status.issuedOn,
              expiresOn: status.expiresOn,
              remainingDays: daysRemaining,
              machineId: status.machineId,
            });

            if (status.expired || daysRemaining <= 0) {
              console.log('[License Check] License has EXPIRED');
              setIsExpired(true);
              setShowExpiredDialog(true);
            } else {
              console.log('[License Check] License is VALID, days left:', daysRemaining);
              setDaysLeft(daysRemaining);
              if (daysRemaining <= 7) {
                setShowExpirationWarning(true);
              }
            }
          }
        }
      } catch (error) {
        console.error('[License Check] Error checking license:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLicense();
  }, []);

  const handleUploadLicense = async () => {
    try {
      const filePath = await window.licenseAPI.browseLicense();
      if (filePath) {
        console.log('[License Check] Activating license from:', filePath);
        
        // Activate the license (validates RSA signature and machine ID)
        const activationResult = await window.licenseAPI.activateLicense(filePath);
        console.log('[License Check] Activation result:', activationResult);
        
        if (!activationResult.valid) {
          // Activation failed - show error based on reason
          const errorReasons = {
            'INVALID_SIGNATURE': 'Invalid license signature. The license file is corrupted or tampered with.',
            'MACHINE_ID_MISMATCH': 'This license is not valid for this machine. The machine ID does not match.',
            'LICENSE_EXPIRED': 'The license in the file has expired.',
            'PUBLIC_KEY_UNAVAILABLE': 'The application public key is unavailable. Please reinstall the application or contact support.',
            'INVALID_LICENSE': 'Invalid license file format.',
            'UNKNOWN_ERROR': 'Unknown error occurred while processing the license.',
          };
          
          const errorMessage = errorReasons[activationResult.reason] || 'Failed to activate license.';
          console.error('[License Check] Activation error:', activationResult.reason, errorMessage);
          throw new Error(errorMessage);
        }
        
        console.log('[License Check] License activated successfully, refreshing status...');
        
        // After successful activation, refresh the license status
        const status = await window.licenseAPI.getLicenseStatus();
        console.log('[License Check] Updated license status after upload:', status);
        
        setLicenseStatus(status);

        if (status && status.licenseType && status.licenseType !== 'INVALID') {
          if (status.expired) {
            setIsExpired(true);
            setShowExpiredDialog(true);
          } else {
            setIsExpired(false);
            setShowExpiredDialog(false);

            const days = status.remainingDays ?? (
              status.expiresOn
                ? Math.max(0, Math.ceil((new Date(status.expiresOn) - new Date()) / (1000 * 60 * 60 * 24)))
                : 0
            );
            setDaysLeft(days);
            
            setLicenseInfo({
              product: status.product || 'Modbus Dashboard',
              customer: status.customer || 'Licensed User',
              licenseType: status.licenseType,
              issuedOn: status.issuedOn,
              expiresOn: status.expiresOn,
              remainingDays: days,
              machineId: status.machineId,
            });
            
            if (days <= 7) {
              setShowExpirationWarning(true);
            } else {
              setShowExpirationWarning(false);
            }
          }
        }
      }
    } catch (error) {
      console.error('[License Check] Error uploading license:', error);
      throw error; // Re-throw to let the caller handle the error display
    }
  };

  return {
    licenseStatus,
    isExpired,
    showExpiredDialog,
    setShowExpiredDialog,
    showExpirationWarning,
    setShowExpirationWarning,
    daysLeft,
    licenseInfo,
    loading,
    handleUploadLicense,
  };
};
