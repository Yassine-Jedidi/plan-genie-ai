import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  notificationService,
  Notification as ApiNotification,
} from "@/services/notificationService";
import { AxiosError } from "axios";

export type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
};

interface NotificationItemProps {
  notification: Notification;
  index: number;
  onMarkAsRead: (id: string) => void;
  textColor?: string;
  hoverBgColor?: string;
  dotColor?: string;
}

const NotificationItem = ({
  notification,
  index,
  onMarkAsRead,
  textColor = "text-foreground",
  dotColor = "bg-foreground",
  hoverBgColor = "hover:bg-[#ffffff37]",
}: NotificationItemProps) => (
  <motion.div
    initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    key={notification.id}
    className={cn(`p-4 ${hoverBgColor} cursor-pointer transition-colors`)}
    onClick={() => onMarkAsRead(notification.id)}
  >
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2">
        {!notification.read && (
          <span className={`h-1 w-1 rounded-full ${dotColor}`} />
        )}
        <h4 className={`text-sm font-medium ${textColor}`}>
          {notification.title}
        </h4>
      </div>

      <span className={`text-xs opacity-80 ${textColor}`}>
        {notification.timestamp.toLocaleDateString()}
      </span>
    </div>
    <p className={`text-xs opacity-70 mt-1 ${textColor}`}>
      {notification.message}
    </p>
  </motion.div>
);

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  textColor?: string;
  hoverBgColor?: string;
  dividerColor?: string;
}

const NotificationList = ({
  notifications,
  onMarkAsRead,
  textColor,
  hoverBgColor,
  dividerColor = "divide-primary/40",
}: NotificationListProps) => (
  <div className={`divide-y ${dividerColor}`}>
    {notifications.map((notification, index) => (
      <NotificationItem
        key={notification.id}
        notification={notification}
        index={index}
        onMarkAsRead={onMarkAsRead}
        textColor={textColor}
        hoverBgColor={hoverBgColor}
      />
    ))}
  </div>
);

interface NotificationPopoverProps {
  onNotificationsChange?: (notifications: Notification[]) => void;
  buttonClassName?: string;
  popoverClassName?: string;
  textColor?: string;
  hoverBgColor?: string;
  dividerColor?: string;
  headerBorderColor?: string;
}

export const NotificationPopover = ({
  onNotificationsChange,
  buttonClassName = "w-10 h-10 rounded-xl bg-primary/70  hover:bg-primary/90 shadow-xl",
  popoverClassName = "bg-card backdrop-blur-sm",
  textColor = "text-foreground",
  hoverBgColor = "hover:bg-primary/40",
  dividerColor = "divide-primary/40",
  headerBorderColor = "border-primary/50",
}: NotificationPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const fetchedNotifications: ApiNotification[] =
          await notificationService.getNotifications();
        const formattedNotifications: Notification[] = fetchedNotifications.map(
          (apiNotif) => ({
            id: apiNotif.id,
            title: apiNotif.title,
            message: apiNotif.message,
            read: apiNotif.read,
            timestamp: new Date(apiNotif.created_at), // Use created_at for display
          })
        );
        setNotifications(formattedNotifications);
        onNotificationsChange?.(formattedNotifications);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.error || err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [onNotificationsChange]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleOpen = () => setIsOpen(!isOpen);

  const markAllAsRead = async () => {
    const updatedNotifications = await Promise.all(
      notifications
        .filter((n) => !n.read)
        .map(async (n) => {
          try {
            await notificationService.markNotificationAsRead(n.id);
            return { ...n, read: true };
          } catch (error) {
            console.error(
              `Failed to mark notification ${n.id} as read:`,
              error
            );
            return n; // Return original notification if update fails
          }
        })
    );
    setNotifications((prevNotifications) =>
      prevNotifications.map((prev) => {
        const updated = updatedNotifications.find((upd) => upd.id === prev.id);
        return updated ? updated : prev;
      })
    );
    onNotificationsChange?.(notifications.map((n) => ({ ...n, read: true }))); // Notify parent with all marked as read
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markNotificationAsRead(id);
      const updatedNotifications = notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      setNotifications(updatedNotifications);
      onNotificationsChange?.(updatedNotifications);
    } catch (error) {
      console.error(`Failed to mark notification ${id} as read:`, error);
    }
  };

  return (
    <div className={`relative ${textColor}`}>
      <Button
        onClick={toggleOpen}
        size="icon"
        className={cn("relative", buttonClassName)}
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-black dark:bg-white rounded-full flex items-center justify-center text-xs border border-gray-800 text-white dark:text-black">
            {unreadCount}
          </div>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute right-0 mt-2 w-80 max-h-[400px] overflow-y-auto rounded-xl shadow-lg",
              popoverClassName
            )}
          >
            <div
              className={`p-4 border-b ${headerBorderColor} flex justify-between items-center`}
            >
              <h3 className="text-sm font-medium">Notifications</h3>
              <Button
                onClick={markAllAsRead}
                variant="ghost"
                size="sm"
                className={`text-xs ${hoverBgColor} hover:text-foreground border`}
              >
                Mark all as read
              </Button>
            </div>

            {loading && (
              <p className="p-4 text-center">Loading notifications...</p>
            )}
            {error && (
              <p className="p-4 text-center text-red-500">Error: {error}</p>
            )}
            {!loading && !error && notifications.length === 0 && (
              <p className="p-4 text-center opacity-70">No notifications</p>
            )}
            {!loading && !error && notifications.length > 0 && (
              <NotificationList
                notifications={notifications}
                onMarkAsRead={markAsRead}
                textColor={textColor}
                hoverBgColor={hoverBgColor}
                dividerColor={dividerColor}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
