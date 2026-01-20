import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Timetable as TimetableType, Session, ActivityItem } from '../timetable';
import { TravelSpot } from '../spots';
import { Card, Button, List, Typography, Divider, Tag, Input } from 'antd';
import { PlusOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { TextArea } = Input;

interface TimetableProps {
  timetable: TimetableType | null;
  cart: TravelSpot[];
  onAddSession: (dayIndex: number, period: 'morning' | 'afternoon' | 'night') => void;
  onUpdateActivity?: (dayIndex: number, period: string, sessionIndex: number, activityIndex: number, updates: Partial<ActivityItem>) => void;
  onDragEnd: (result: DropResult) => void;
}

const ActivityCard: React.FC<{ 
    activity: ActivityItem; 
    onUpdate: (updates: Partial<ActivityItem>) => void; 
}> = ({ activity, onUpdate }) => {
    return (
        <Card size="small" className="shadow-sm border-border mb-2" bodyStyle={{ padding: '8px' }}>
            <div className="flex gap-3">
                {activity.spotReference && (
                    <img src={activity.spotReference.imageUrl} alt={activity.title} className="w-16 h-16 rounded object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-text truncate mb-1">{activity.title}</div>
                    <div className="text-xs text-text-secondary flex items-center gap-1 mb-2 truncate">
                        <EnvironmentOutlined /> {activity.location}
                    </div>
                    <TextArea 
                        placeholder="Add remarks..." 
                        autoSize={{ minRows: 1, maxRows: 3 }}
                        value={activity.remarks}
                        onChange={(e) => onUpdate({ remarks: e.target.value })}
                        className="text-xs !bg-gray-50 border-none focus:!bg-white focus:shadow-none p-1 rounded"
                        bordered={false}
                    />
                </div>
            </div>
        </Card>
    );
};

const SessionCell: React.FC<{
  session: Session;
  dayIndex: number;
  period: string;
  sessionIndex: number;
  label?: string;
  canAdd?: boolean;
  onAdd?: () => void;
  onUpdateActivity?: (dayIndex: number, period: string, sessionIndex: number, activityIndex: number, updates: Partial<ActivityItem>) => void;
}> = ({ session, dayIndex, period, sessionIndex, label, canAdd, onAdd, onUpdateActivity }) => {
  const droppableId = `${dayIndex}-${period}-${sessionIndex}`;
  
  return (
    <div className="flex flex-col mb-2">
      <div className="flex justify-between items-center mb-1">
        <Text strong className="capitalize text-text-secondary font-heading">{label || period}</Text>
        {canAdd && onAdd && (
          <Button 
            type="text" 
            size="small" 
            icon={<PlusOutlined />} 
            onClick={onAdd}
            className="text-cta hover:text-primary"
          />
        )}
      </div>
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`p-2 border border-dashed rounded min-h-[60px] transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-background border-cta' : 'bg-white border-border'
            }`}
          >
            {session.activities.map((item, index) => (
              <div key={item.id} className="mb-2 last:mb-0">
                 <ActivityCard 
                    activity={item} 
                    onUpdate={(updates) => onUpdateActivity && onUpdateActivity(dayIndex, period, sessionIndex, index, updates)}
                 />
              </div>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

const TimetableComponent: React.FC<TimetableProps> = ({ timetable, cart, onAddSession, onUpdateActivity, onDragEnd }) => {
  if (!timetable) {
    return <div className="p-8 text-center"><Text className="text-text-secondary">Please set up flight information to generate a timetable.</Text></div>;
  }

  return (
    <DragDropContext onDragEnd={(res) => onDragEnd(res)}>
      <div className="flex h-full gap-4">
        {/* Cart Sidebar */}
        <div className="w-1/4 min-w-[250px] flex flex-col h-[calc(100vh-100px)] sticky top-4">
          <Card title={<span className="text-primary font-heading">Attractions</span>} className="h-full flex flex-col border-border shadow-sm" bodyStyle={{ flex: 1, overflow: 'hidden', padding: '12px' }}>
            <Droppable droppableId="cart">
              {(provided) => (
                <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef} 
                    className="h-full overflow-y-auto pr-2"
                >
                  <List
                    dataSource={cart}
                    renderItem={(item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2"
                            style={{ ...provided.draggableProps.style }}
                          >
                             <Card 
                                size="small"
                                hoverable
                                className={`transform transition-all border-border ${snapshot.isDragging ? 'shadow-lg rotate-2 scale-105 border-primary' : ''}`}
                                cover={<img alt={item.name} src={item.imageUrl} className="h-32 object-cover" />}
                              >
                                <Card.Meta title={<span className="text-text font-medium">{item.name}</span>} description={<Tag color="blue">{item.type}</Tag>} />
                              </Card>
                          </div>
                        )}
                      </Draggable>
                    )}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Card>
        </div>

        {/* Timetable Grid */}
        <div className="w-3/4 overflow-x-auto pb-4">
           <div className="flex gap-4">
             {timetable.schedule.map((day, dayIndex) => (
               <Card 
                key={dayIndex} 
                title={<span className="text-primary font-heading">{new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>}
                className="w-[300px] flex-shrink-0 shadow-md border-t-4 border-t-primary"
                bodyStyle={{ padding: '12px', backgroundColor: '#FDF2F8' }} 
               >
                 <div className="flex flex-col gap-1">
                    <SessionCell 
                        session={day.sessions.breakfast} 
                        dayIndex={dayIndex} 
                        period="breakfast" 
                        sessionIndex={0} 
                        label="🍳 Breakfast"
                        onUpdateActivity={onUpdateActivity}
                    />
                    
                    <Divider className="my-2 border-border" />
                    
                    {day.sessions.morning.map((session, sIdx) => (
                        <SessionCell 
                            key={session.id}
                            session={session}
                            dayIndex={dayIndex}
                            period="morning"
                            sessionIndex={sIdx}
                            label={sIdx === 0 ? "☀️ Morning" : ""}
                            canAdd={sIdx === 0}
                            onAdd={() => onAddSession(dayIndex, 'morning')}
                            onUpdateActivity={onUpdateActivity}
                        />
                    ))}

                    <Divider className="my-2 border-border" />

                    <SessionCell 
                        session={day.sessions.lunch} 
                        dayIndex={dayIndex} 
                        period="lunch" 
                        sessionIndex={0} 
                        label="🍱 Lunch"
                        onUpdateActivity={onUpdateActivity}
                    />

                    <Divider className="my-2 border-border" />

                    {day.sessions.afternoon.map((session, sIdx) => (
                        <SessionCell 
                            key={session.id}
                            session={session}
                            dayIndex={dayIndex}
                            period="afternoon"
                            sessionIndex={sIdx}
                            label={sIdx === 0 ? "🍵 Afternoon" : ""}
                            canAdd={sIdx === 0}
                            onAdd={() => onAddSession(dayIndex, 'afternoon')}
                            onUpdateActivity={onUpdateActivity}
                        />
                    ))}

                    <Divider className="my-2 border-border" />

                    <SessionCell 
                        session={day.sessions.dinner} 
                        dayIndex={dayIndex} 
                        period="dinner" 
                        sessionIndex={0} 
                        label="🍽️ Dinner"
                        onUpdateActivity={onUpdateActivity}
                    />

                    <Divider className="my-2 border-border" />

                    {day.sessions.night.map((session, sIdx) => (
                        <SessionCell 
                            key={session.id}
                            session={session}
                            dayIndex={dayIndex}
                            period="night"
                            sessionIndex={sIdx}
                            label={sIdx === 0 ? "🌙 Night" : ""}
                            canAdd={sIdx === 0}
                            onAdd={() => onAddSession(dayIndex, 'night')}
                            onUpdateActivity={onUpdateActivity}
                        />
                    ))}
                 </div>
               </Card>
             ))}
           </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default TimetableComponent;