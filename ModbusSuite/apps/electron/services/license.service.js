import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

import { getMachineId } from "./machine.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicKey = fs.readFileSync(
    path.join(__dirname, "../keys/public.pem"),
    "utf8"
);

export function verifyLicenseFile(filePath) {

    try {

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

        if (new Date(license.expiresOn) < new Date()) {

            return {

                valid: false,

                reason: "LICENSE_EXPIRED"

            };

        }

        return {

            valid: true,

            customer: license.customer,

            expiresOn: license.expiresOn,

            licenseType: license.licenseType

        };

    }

    catch (err) {

        return {

            valid: false,

            reason: "INVALID_LICENSE"

        };

    }

}