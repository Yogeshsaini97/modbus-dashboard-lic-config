import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

import { getMachineId } from "./machine.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicKeyPath = path.join(__dirname, "keys/public.pem");

function loadPublicKey() {
    return fs.readFileSync(publicKeyPath, "utf8");
}

export function verifyLicenseFile(filePath) {

    try {

        // Load lazily so a key deployment problem never prevents Electron from
        // creating its window. The IPC caller receives a useful failure reason.
        const publicKey = loadPublicKey();

        const file = fs.readFileSync(filePath, "utf8");

        const license = JSON.parse(file);

        const signature = license.signature;

        delete license.signature;

        const verify = crypto.createVerify("RSA-SHA256");

        verify.update(JSON.stringify(license));

        verify.end();

        const valid = verify.verify(
            publicKey,
            signature,
            "base64"
        );

        if (!valid) {

            return {

                valid: false,

                reason: "INVALID_SIGNATURE"

            };

        }

        if (license.machineId !== getMachineId()) {

            return {

                valid: false,

                reason: "MACHINE_ID_MISMATCH"

            };

        }

        const expiresAt = new Date(license.expiresOn);

        if (Number.isNaN(expiresAt.getTime()) || expiresAt < new Date()) {

            return {

                valid: false,

                reason: "LICENSE_EXPIRED"

            };

        }

        return {

            valid: true,

            customer: license.customer,

            expiresOn: license.expiresOn,

            remainingDays: Math.max(
                0,
                Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            ),

            // Older/generated license files may omit this optional display
            // field. A verified license must still unlock the application.
            licenseType: license.licenseType || "LICENSE"

        };

    }

    catch (err) {

        console.error("[Licensing] License verification failed", {
            code: err.code,
            message: err.message,
        });

        return {

            valid: false,

            reason: err.code === "ENOENT"
                ? "PUBLIC_KEY_UNAVAILABLE"
                : "INVALID_LICENSE"

        };

    }

}
