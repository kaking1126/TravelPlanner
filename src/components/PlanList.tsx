import React from 'react';
import { Plan } from '../timetable';
import { List, Button, Card, Typography, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, RightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface PlanListProps {
  plans: Plan[];
  onAddPlan: () => void;
  onSelectPlan: (plan: Plan) => void;
  onDeletePlan: (id: string) => void;
}

const PlanList: React.FC<PlanListProps> = ({ plans, onAddPlan, onSelectPlan, onDeletePlan }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="font-heading !text-text">My Travel Plans</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddPlan} size="large" className="bg-cta hover:bg-secondary border-none shadow-lg">
          Create New Plan
        </Button>
      </div>

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
        dataSource={plans}
        renderItem={(plan) => (
          <List.Item>
            <Card
              hoverable
              className="border-border hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md bg-surface"
              actions={[
                <Popconfirm
                  title="Delete the plan"
                  description="Are you sure to delete this plan?"
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    onDeletePlan(plan.id);
                  }}
                  onCancel={(e) => e?.stopPropagation()}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="text" danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()}>
                    Delete
                  </Button>
                </Popconfirm>,
                <Button type="link" onClick={() => onSelectPlan(plan)} className="text-cta hover:text-primary">
                  Open <RightOutlined />
                </Button>
              ]}
              onClick={() => onSelectPlan(plan)}
            >
              <Card.Meta
                title={<span className="font-heading text-lg text-primary">{plan.title}</span>}
                description={
                  <div>
                    <Text className="block text-text-secondary">Created: {new Date(plan.createdAt).toLocaleDateString()}</Text>
                    <Text className="block mt-2 font-medium text-text">
                        {plan.timetable ? 
                            `${plan.timetable.flight.arrival.arrivalAirport} ➔ ${plan.timetable.flight.arrival.departureAirport}` : 
                            'No itinerary yet'}
                    </Text>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />
      
      {plans.length === 0 && (
        <div className="text-center py-12 bg-surface rounded-lg border-2 border-dashed border-border">
          <Text className="text-lg text-text-secondary">No plans yet. Create one to get started!</Text>
        </div>
      )}
    </div>
  );
};

export default PlanList;