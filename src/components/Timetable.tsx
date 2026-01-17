import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { FlightDetails, DayPlan } from '../timetable';
import { TravelSpot } from '../spots';
import { Card, Button, List, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface TimetableProps {
  flightInfo: { arrival: FlightDetails, departure: FlightDetails } | null;
  cart: TravelSpot[];
}

const createEmptyDay = (date: Date): DayPlan => ({
  date,
  meals: {
    breakfast: [{ time: '09:00', activity: 'Breakfast' }],
    lunch: [{ time: '13:00', activity: 'Lunch' }],
    dinner: [{ time: '19:00', activity: 'Dinner' }],
  },
  activities: [{ time: '10:00', activity: 'Morning Schedule' }, { time: '14:00', activity: 'Afternoon Schedule' }, { time: '20:00', activity: 'Night Schedule' }],
});

const TimetableComponent: React.FC<TimetableProps> = ({ flightInfo, cart }) => {
  const [schedule, setSchedule] = useState<DayPlan[]>(() => {
    if (!flightInfo) return [];

    const arrival = new Date(flightInfo.arrival.arrivalTime);
    const departure = new Date(flightInfo.departure.departureTime);
    const days = [];
    let currentDate = new Date(arrival.getFullYear(), arrival.getMonth(), arrival.getDate());

    while (currentDate <= departure) {
      days.push(createEmptyDay(new Date(currentDate)));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (days.length > 0) {
      days[0].activities = [{ time: 'Arrival', activity: flightInfo.arrival.flightNumber }];
      days[days.length - 1].activities = [{ time: 'Departure', activity: flightInfo.departure.flightNumber }];
    }

    return days;
  });

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    if (sourceId === 'cart' && destId.startsWith('day-')) {
      const dayIndex = parseInt(destId.split('-')[1], 10);
      const activityIndex = parseInt(destId.split('-')[2], 10);
      const spot = cart[source.index];
      const newSchedule = [...schedule];
      newSchedule[dayIndex].activities[activityIndex].activity = spot;
      setSchedule(newSchedule);
    }
  };

  const addRow = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].activities.push({ time: 'New Slot', activity: 'New Activity' });
    setSchedule(newSchedule);
  }

  if (!flightInfo) {
    return <Title level={3} style={{ textAlign: 'center', margin: '20px' }}>Please enter flight information first.</Title>
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex">
        <div className="w-1/4 p-4">
          <Card title="Travel Spots Cart">
            <Droppable droppableId="cart">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-[200px]">
                  <List
                    dataSource={cart}
                    renderItem={(item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <List.Item>
                              <Card 
                                hoverable
                                cover={<img alt={item.name} src={item.imageUrl} />}
                              >
                                <Card.Meta title={item.name} />
                              </Card>
                            </List.Item>
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
        <div className="w-3/4 flex overflow-x-auto p-4">
          {schedule.map((dayPlan, dayIndex) => (
            <Card
              key={dayIndex}
              title={dayPlan.date.toLocaleDateString()}
              className="w-[280px] flex-shrink-0 m-2"
              actions={[<Button type="dashed" onClick={() => addRow(dayIndex)} icon={<PlusOutlined />}>Add Row</Button>]}
            >
              {dayPlan.activities.map((activity, activityIndex) => (
                <Droppable key={activityIndex} droppableId={`day-${dayIndex}-${activityIndex}`}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`p-2 border border-dashed border-gray-300 rounded mt-2 min-h-[60px] transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-secondary/20' : 'bg-white'}`}
                    >
                      <Text strong>{activity.time}</Text>
                      <div className="text-center">
                        {typeof activity.activity === 'string' 
                          ? activity.activity 
                          : (
                            <Card
                              size="small"
                              cover={<img alt={activity.activity.name} src={activity.activity.imageUrl} />}
                            >
                              <Card.Meta title={activity.activity.name} />
                            </Card>
                          )
                        }
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </Card>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default TimetableComponent;
