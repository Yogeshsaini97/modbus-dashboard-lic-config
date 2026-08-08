import { useEffect } from "react";
import Dashboard from "./Pages/Dashboard/Dashboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LicenseExpiredDialog from "./Components/License/LicenseExpiredDialog";
import LicenseExpirationWarning from "./Components/License/LicenseExpirationWarning";
import { useLicenseCheck } from "./Hooks/useLicenseCheck";
import { Box, CircularProgress } from "@mui/material";

function App() {
  const {
    isExpired,
    showExpiredDialog,
    setShowExpiredDialog,
    showExpirationWarning,
    setShowExpirationWarning,
    daysLeft,
    licenseInfo,
    loading,
    handleUploadLicense,
  } = useLicenseCheck();

  useEffect(() => {
    console.log('[App] License state updated:', {
      isExpired,
      showExpiredDialog,
      showExpirationWarning,
      loading,
      licenseInfo,
      daysLeft,
    });
  }, [isExpired, showExpiredDialog, showExpirationWarning, loading, licenseInfo, daysLeft]);

  useEffect(() => {
    if (isExpired && showExpiredDialog) {
      console.log('[App] Showing expired license toast');
      toast.error("Your license has expired. Please upload a new license file.", {
        autoClose: false,
      });
    }
  }, [isExpired, showExpiredDialog]);

  useEffect(() => {
    if (showExpirationWarning && daysLeft <= 7) {
      toast.warning(`Your license will expire in ${daysLeft} days!`, {
        autoClose: false,
      });
    }
  }, [showExpirationWarning, daysLeft]);

  const handleLicenseUpload = async () => {
    try {
      console.log('[App] Starting license upload...');
      await handleUploadLicense();
      setShowExpiredDialog(false);
      toast.success("License updated successfully!", {
        autoClose: 5000,
      });
    } catch (error) {
      console.error("Error uploading license:", error);
      toast.error(error.message || "Failed to upload license. Please try again.", {
        autoClose: 5000,
      });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If license is expired, ONLY show the expired dialog, not the dashboard
  if (isExpired) {
    console.log('[App] Rendering expired license dialog, showExpiredDialog:', showExpiredDialog);
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <LicenseExpiredDialog
          open={isExpired}
          onUpload={handleLicenseUpload}
          licenseInfo={licenseInfo}
          loading={loading}
        />
        <ToastContainer
          position="top-right"
          autoClose={9000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </Box>
    );
  }

  // Otherwise show dashboard with expiration warning if needed
  return (
    <>
      <Dashboard licenseInfo={licenseInfo} daysLeft={daysLeft} />
      <LicenseExpirationWarning
        open={showExpirationWarning && !showExpiredDialog}
        onClose={() => setShowExpirationWarning(false)}
        licenseInfo={licenseInfo}
        daysLeft={daysLeft}
      />
      <ToastContainer
        position="top-right"
        autoClose={9000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
