import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/dateUtils";
import {
  notificationService,
  Notification as ApiNotification,
} from "@/services/notificationService";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

export type Notification = {
  id: string;
  title: string;
  time: Date;
  created_at: Date;
  read: boolean;
  type: string;
};

// Function to get a human-readable message based on notification type and time
const getNotificationMessage = (
  type: string,
  time: Date,
  title: string,
  t: (key: string, options?: Record<string, string>) => string
) => {
  const timeString = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString = time.toLocaleDateString();

  switch (type) {
    case "task_due_in_1day":
      return t("notificationPopover.messages.taskDueTomorrow", {
        title,
        time: timeString,
      });
    case "event_in_1day":
      return t("notificationPopover.messages.eventTomorrow", {
        title,
        time: timeString,
      });
    case "task_due_in_6h":
      return t("notificationPopover.messages.taskDueIn6h", {
        title,
        time: timeString,
      });
    case "event_in_6h":
      return t("notificationPopover.messages.eventIn6h", {
        title,
        time: timeString,
      });
    case "task_due_in_1h":
      return t("notificationPopover.messages.taskDueIn1h", {
        title,
        time: timeString,
      });
    case "event_in_1h":
      return t("notificationPopover.messages.eventIn1h", {
        title,
        time: timeString,
      });
    case "task_due_in_15m":
      return t("notificationPopover.messages.taskDueIn15m", {
        title,
        time: timeString,
      });
    case "event_in_15m":
      return t("notificationPopover.messages.eventIn15m", {
        title,
        time: timeString,
      });
    default:
      return type.includes("task")
        ? t("notificationPopover.messages.defaultTask", {
            title,
            time: timeString,
            date: dateString,
          })
        : t("notificationPopover.messages.defaultEvent", {
            title,
            time: timeString,
            date: dateString,
          });
  }
};

// Function to get dot color based on notification type
const getNotificationDotColor = (type: string) => {
  switch (type) {
    case "task_due_in_1day":
    case "event_in_1day":
      return "bg-blue-500"; // Tomorrow notifications
    case "task_due_in_6h":
    case "event_in_6h":
      return "bg-yellow-500"; // 6 hours notifications
    case "task_due_in_1h":
    case "event_in_1h":
      return "bg-orange-500"; // 1 hour notifications
    case "task_due_in_15m":
    case "event_in_15m":
      return "bg-red-500"; // 15 minutes notifications
    default:
      return "bg-gray-500";
  }
};

interface NotificationItemProps {
  notification: Notification;
  index: number;
  onMarkAsRead: (id: string) => void;
  textColor?: string;
  hoverBgColor?: string;
}

const NotificationItem = ({
  notification,
  index,
  onMarkAsRead,
  textColor = "text-foreground",
  hoverBgColor = "hover:bg-[#ffffff37]",
}: NotificationItemProps) => {
  const { t } = useTranslation();
  const dotColorClass = getNotificationDotColor(notification.type);

  return (
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
            <span className={cn("h-1 w-1 rounded-full", dotColorClass)} />
          )}
          <h4 className={`text-sm font-medium ${textColor}`}>
            {notification.type.includes("task")
              ? t("notificationPopover.taskReminder", {
                  title: notification.title,
                })
              : notification.type.includes("event")
              ? t("notificationPopover.eventReminder", {
                  title: notification.title,
                })
              : notification.title}
          </h4>
        </div>

        <span className={`text-xs opacity-80 ${textColor}`}>
          {notification.created_at.toLocaleDateString([], {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <p className={`text-xs opacity-70 mt-1 ${textColor}`}>
        {getNotificationMessage(
          notification.type,
          notification.time,
          notification.title,
          t
        )}
      </p>
    </motion.div>
  );
};

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
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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
            time: new Date(apiNotif.time),
            created_at: new Date(apiNotif.created_at),
            read: apiNotif.read,
            type: apiNotif.type,
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
          setError(t("notificationPopover.unknownError"));
        }
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications(); // Initial fetch

    const intervalId = setInterval(fetchNotifications, 60000); // Poll every 1 minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [onNotificationsChange, t]);

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
    <div className={`relative ${textColor}`} ref={popoverRef}>
      <Button
        onClick={toggleOpen}
        size="icon"
        className={cn("relative", buttonClassName)}
        aria-label={t("notificationPopover.openNotifications")}
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
            aria-label={t("notificationPopover.notificationsList")}
          >
            <div
              className={`p-4 border-b ${headerBorderColor} flex justify-between items-center`}
            >
              <h3 className="text-sm font-medium">
                {t("notificationPopover.notifications")}
              </h3>
              <Button
                onClick={markAllAsRead}
                variant="ghost"
                size="sm"
                className={`text-xs ${hoverBgColor} hover:text-foreground border`}
                aria-label={t("notificationPopover.markAllAsRead")}
              >
                {t("notificationPopover.markAllAsRead")}
              </Button>
            </div>

            {loading && (
              <p className="p-4 text-center">
                {t("notificationPopover.loading")}
              </p>
            )}
            {error && (
              <p className="p-4 text-center text-red-500">
                {t("notificationPopover.error", { error })}
              </p>
            )}
            {!loading && !error && notifications.length === 0 && (
              <p className="p-4 text-center opacity-70">
                {t("notificationPopover.noNotifications")}
              </p>
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
