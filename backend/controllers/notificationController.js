// In-memory placeholder. Replace with a Notification model + real email/SMS
// provider (e.g. SendGrid, Twilio) once you're ready to wire it up.
const notifications = [];

const createNotification = ({ userId, type, message }) => {
  const notification = { id: notifications.length + 1, userId, type, message, read: false, createdAt: new Date() };
  notifications.push(notification);
  return notification;
};

// GET /api/notifications/my
const getMyNotifications = (req, res) => {
  const mine = notifications.filter((n) => String(n.userId) === String(req.user._id));
  res.json(mine);
};

// PATCH /api/notifications/:id/read
const markAsRead = (req, res) => {
  const notification = notifications.find((n) => n.id === Number(req.params.id));
  if (!notification) return res.status(404).json({ message: "Notification not found" });
  notification.read = true;
  res.json(notification);
};

module.exports = { createNotification, getMyNotifications, markAsRead };
