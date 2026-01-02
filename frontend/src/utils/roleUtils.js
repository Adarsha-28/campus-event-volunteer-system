export const isAdmin = (role) => role === "admin";
export const isOrganizer = (role) => role === "organizer";
export const isUser = (role) => role === "user";
export const canCreateEvent = (role) => role === "organizer";
