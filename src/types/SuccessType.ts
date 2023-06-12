export const SuccessTypes = ["fail", "succeed", "normal"] as const;
type SuccessType = (typeof SuccessTypes)[number];
export default SuccessType;
