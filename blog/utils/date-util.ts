
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// Format the day suffix
const daySuffix = (day: number) => {
  if (day > 3 && day < 21) return 'th'; // Exceptions like 11th, 12th, 13th
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};
export function formatHumanReadableDate(date: Date) {
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  
  // Get the hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Determine AM/PM
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12; // Convert to 12-hour format and adjust for midnight

  // Format the time
  const formattedTime = `${hours}:${minutes}${ampm}`;
  
  // Combine date and time with timezone
  return `${day}${daySuffix(day)} ${month}, ${year} at ${formattedTime} IST`;
}