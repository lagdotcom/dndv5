export const SuccessTypes = ["fail", "success", "normal"] as const;
type SuccessType = (typeof SuccessTypes)[number];
export default SuccessType;
