export const SaveDamageResponses = ["normal", "half", "zero"] as const;
type SaveDamageResponse = (typeof SaveDamageResponses)[number];
export default SaveDamageResponse;
