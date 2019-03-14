export default function toEditableDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
  } catch {
    return 'NOT A DATE';
  }
}
