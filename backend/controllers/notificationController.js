import Notification from "../models/Notification.js";

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.json({ notifications });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUnreadNotificationCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });
    return res.json({ unreadCount: count });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createNotification = async (req, res) => {
  try {
    const { type, title, message, actionUrl, metadata } = req.body || {};

    if (!title || !message) {
      return res
        .status(400)
        .json({ message: "Title and message are required" });
    }

    const notification = await Notification.create({
      user: req.user._id,
      type: type || "system",
      title,
      message,
      actionUrl: actionUrl || "",
      metadata: metadata || {},
    });

    return res
      .status(201)
      .json({ message: "Notification created", notification });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    return res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true, readAt: new Date() } },
    );

    return res.json({ message: "All notifications marked as read" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json({ message: "Notification deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  getNotifications,
  getUnreadNotificationCount,
  createNotification,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
};
