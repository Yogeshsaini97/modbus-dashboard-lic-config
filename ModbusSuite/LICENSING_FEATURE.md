# License Check Feature Implementation

## Overview
This feature implements automatic license validation when the Modbus Dashboard app opens. It checks if the current license is expired and displays appropriate dialogs to the user.

## Feature Behavior

### 1. On App Startup
The app automatically checks the license status using the existing licensing system.

### 2. If License Has Expired
- A **red dialog** appears titled "License Expired"
- Shows customer name and expiration date
- Displays error alert message
- Provides an "Upload License File" button
- User can select a new license file (.lic) from their system
- A toast notification is also shown as a secondary alert

### 3. If License Is Valid (Not Expired)
- A **blue information dialog** appears showing:
  - Customer name
  - License type
  - Expiration date
  - **Days remaining** (calculated from expiration date)
  - Visual progress bar showing time left
  - Color-coded warning levels:
    - **Red** (Critical): 7 days or less remaining
    - **Orange** (Warning): 8-30 days remaining
    - **Green** (Safe): More than 30 days remaining

### 4. Toast Notifications
- Critical alerts appear for expired or soon-to-expire licenses
- Success notification when a new license is uploaded

## Files Created/Modified

### New Files
1. **`src/Hooks/useLicenseCheck.js`**
   - Custom React hook that handles license status checking
   - Manages state for expired/warning dialogs
   - Calculates days remaining
   - Handles license upload process

2. **`src/Components/License/LicenseExpiredDialog.jsx`**
   - Dialog component for expired license scenario
   - Shows customer info and expired date
   - Upload button to select new license file

3. **`src/Components/License/LicenseExpirationWarning.jsx`**
   - Dialog component for valid but expiring license
   - Shows days remaining with visual progress bar
   - Color-coded warnings based on urgency
   - Displays customer and license type information

### Modified Files
1. **`src/App.jsx`**
   - Integrated license check hook
   - Added license dialogs to app layout
   - Added loading state display
   - Added toast notifications for user feedback
   - Added upload handler with success/error handling

## How It Works

### Data Flow
```
App Mount
  ↓
useLicenseCheck Hook
  ↓
window.licenseAPI.getLicenseStatus()
  ↓
Check expiration date against current date
  ↓
├─ Expired → Show LicenseExpiredDialog
│  ├─ User uploads file
│  ├─ Re-check license status
│  └─ Show success or keep expired dialog
│
└─ Valid → Show LicenseExpirationWarning
   └─ Calculate and display days remaining
```

### License Status Check
The hook uses the Electron IPC bridge to call `window.licenseAPI.getLicenseStatus()`, which:
1. Reads the license file from `userData/license/license.lic`
2. Validates the RSA signature
3. Checks machine ID match
4. Verifies expiration date
5. Returns license info object

### Expiration Calculation
```javascript
const expiresOn = new Date(status.expiresOn);
const now = new Date();
const timeDiff = expiresOn - now;
const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
```

## User Experience

### Scenario 1: License Expired
```
App Opens
  ↓
Red Error Dialog appears
  ↓
User clicks "Upload License File"
  ↓
File browser opens (filtered for .lic files)
  ↓
User selects new license
  ↓
License validated
  ↓
Success toast → Dialog closes → App continues
```

### Scenario 2: License Valid but Expiring Soon
```
App Opens
  ↓
Blue Info Dialog appears
  ↓
Shows: "30 days left" with green progress bar
  ↓
User clicks "Understood"
  ↓
Dialog closes → App continues normally
```

### Scenario 3: Non-Electron Environment
If the app runs outside Electron (e.g., web):
- License API not available warning logged to console
- App continues normally without license checks
- Feature gracefully degrades

## Integration with Existing System

This feature leverages the existing licensing infrastructure:
- ✅ Uses existing `window.licenseAPI` from preload.cjs
- ✅ Uses existing `get-license-status` IPC handler
- ✅ Uses existing `browse-license` IPC handler
- ✅ Uses existing license file format and validation
- ✅ Compatible with RSA signature verification
- ✅ Compatible with machine ID binding
- ✅ Compatible with trial mode fallback

## Customization

### Change Warning Thresholds
Edit `LicenseExpirationWarning.jsx`:
```javascript
const getWarningLevel = () => {
  if (daysLeft <= 7) return 'error';      // Change 7 to custom value
  if (daysLeft <= 30) return 'warning';   // Change 30 to custom value
  return 'info';
};
```

### Disable Auto-Close for Expired Dialog
Edit `App.jsx`:
```javascript
// Remove the auto-close on successful upload, or modify:
setShowExpiredDialog(false); // Comment this line to keep dialog open
```

### Customize Dialog Colors
Edit the component files and modify the `sx` props:
```javascript
<DialogTitle sx={{ backgroundColor: '#d32f2f', color: 'white' }}>
```

## Testing

### Test Expired License
1. Create a license file with `expiresOn` set to a past date
2. Run the app
3. Verify red "License Expired" dialog appears

### Test Valid License
1. Create a license file with `expiresOn` set to a future date (e.g., 30 days from now)
2. Run the app
3. Verify blue "License Expiration Information" dialog appears with correct days remaining

### Test Upload
1. Place a valid license file (.lic) on your system
2. Click "Upload License File" button
3. Select the license file
4. Verify success toast and dialog closes

## Notes
- The feature runs on app startup and doesn't require user interaction to trigger
- Both dialogs are modal (user must interact before proceeding)
- Toast notifications provide additional UX feedback
- Progress bar gives visual feedback about license validity
- All calculations are based on local time

## Future Enhancements
- Add periodic license checks during app runtime (e.g., every hour)
- Add email notification support when license is about to expire
- Add license auto-renewal integration (if applicable)
- Add license sharing/transfer UI
- Add detailed license history view
