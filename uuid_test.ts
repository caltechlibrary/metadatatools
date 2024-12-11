import { assertEquals } from "@std/assert";
import { normalizeUUID, validateUUID } from "./uuid.ts";

const verified_ids = [
    "13e4f940-b7ed-11ef-a2c5-ed8b1faf2c9d",
    "a6435f0d-60ea-47a7-94ff-1d1c394c1280",
    "21bbd59d-9801-53ce-8902-9559de3ebd39"
];

for (const id of verified_ids) {
    // Normalize
    const normalized = normalizeUUID(id);
    console.log(`Normalized UUID: ${normalized}`);
    // Validate
    assertEquals(validateUUID(id), true);
}

