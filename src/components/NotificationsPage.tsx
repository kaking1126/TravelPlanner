import React from 'react';

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'alert';
}

const sampleNotifications: Notification[] = [
  { id: 1, message: 'Flight BA308 has been delayed by 30 minutes.', type: 'warning' },
  { id: 2, message: 'The Louvre Museum will be closed on August 2nd for a private event.', type: 'alert' },
  { id: 3, message: 'Weather forecast for Paris: Sunny with a high of 25°C.', type: 'info' },
];

interface NotificationsPageProps {
  onClose: () => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-background p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-text-primary">Notifications</h2>
        <button onClick={onClose} className="text-2xl text-text-secondary hover:text-text-primary">&times;</button>
      </div>
      <ul>
        {sampleNotifications.map((notification) => (
          <li key={notification.id} className={`p-2 rounded mb-2 ${
            notification.type === 'warning' ? 'bg-accent/20 text-accent' :
            notification.type === 'alert' ? 'bg-danger/20 text-danger' : 'bg-secondary/20 text-secondary'
          }`}>
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage;
