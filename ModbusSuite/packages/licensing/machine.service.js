import machineId from "node-machine-id";
import crypto from "crypto";

export function getMachineId() {
  const rawMachineId = machineId.machineIdSync();

  const hash = crypto
    .createHash("sha256")
    .update(rawMachineId)
    .digest("hex")
    .toUpperCase();

  return [
    hash.substring(0, 4),
    hash.substring(4, 8),
    hash.substring(8, 12),
    hash.substring(12, 16),
  ].join("-");
}