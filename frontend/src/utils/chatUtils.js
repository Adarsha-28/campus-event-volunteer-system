export const canAccessChat = (uid, event) => {
  return (
    event.organizerId === uid ||
    event.volunteers.includes(uid)
  );
};