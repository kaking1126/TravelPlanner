import React, { useState } from 'react';
import { Layout, Button, Card, List, Row, Col, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Map from './Map';
import SpotDetails from './SpotDetails';
import { TravelSpot } from '../spots';
import TimetableComponent from './Timetable';
import CostEstimationComponent from './CostEstimation';
import { sampleCosts } from '../sampleCosts';
import FlightInfo from './FlightInfo';
import { FlightDetails, Plan } from '../timetable';
import { useTimetableViewModel } from '../viewmodels/useTimetableViewModel';

const { Content, Sider } = Layout;
const { Title } = Typography;

const STAGES = {
  MAP_SELECTION: 'Map Selection',
  FLIGHT_INFO: 'Flight Info',
  TIMETABLE_SCHEDULE: 'Timetable Schedule',
  COST_ESTIMATION: 'Cost Estimation',
};

interface PlanEditorProps {
  plan: Plan;
  onUpdatePlan: (plan: Plan) => void;
  onBack: () => void;
}

const PlanEditor: React.FC<PlanEditorProps> = ({ plan, onUpdatePlan, onBack }) => {
  const [currentStage, setCurrentStage] = useState(STAGES.MAP_SELECTION);
  const [selectedSpot, setSelectedSpot] = useState<TravelSpot | null>(null);
  
  // Cart management
  const handleAddToCart = (spot: TravelSpot) => {
    const newCart = [...(plan.cart || []), spot];
    onUpdatePlan({ ...plan, cart: newCart });
  };

  // Timetable ViewModel
  const { timetable, generateTimetableFromFlight, addSessionRow, onDragEnd } = useTimetableViewModel(
    plan.timetable,
    (newTimetable) => {
        onUpdatePlan({ ...plan, timetable: newTimetable });
    }
  );

  const handleFlightInfoSubmit = (info: { arrival: FlightDetails, departure: FlightDetails }) => {
    generateTimetableFromFlight(info);
    setCurrentStage(STAGES.TIMETABLE_SCHEDULE);
  };

  const renderCurrentStage = () => {
    switch (currentStage) {
      case STAGES.MAP_SELECTION:
        return (
          <Layout style={{ height: 'calc(100vh - 200px)' }} className="bg-surface border border-border rounded-lg overflow-hidden">
            <Content>
              <Map onSelectSpot={setSelectedSpot} />
            </Content>
            <Sider width={300} theme="light" style={{ overflow: 'auto', padding: '10px' }} className="border-l border-border bg-surface">
              {selectedSpot ? <SpotDetails spot={selectedSpot} onAddToCart={handleAddToCart} /> : <div className="p-4 text-text-secondary">Select a spot on the map to see details</div>}
            </Sider>
            <Sider width={250} theme="light" style={{ overflow: 'auto', borderLeft: '1px solid #FBCFE8', padding: '10px' }} className="bg-surface">
              <Title level={5} className="!text-primary font-heading">Selected Spots</Title>
              <List
                dataSource={plan.cart || []}
                renderItem={item => (
                  <List.Item>
                    <Card
                      hoverable
                      size="small"
                      className="border-border w-full"
                      cover={<img alt={item.name} src={item.imageUrl} className="h-20 object-cover" />}
                    >
                      <Card.Meta title={<span className="text-text font-medium">{item.name}</span>} />
                    </Card>
                  </List.Item>
                )}
              />
            </Sider>
          </Layout>
        );
      case STAGES.FLIGHT_INFO:
        return <FlightInfo onFlightInfoSubmit={handleFlightInfoSubmit} />;
      case STAGES.TIMETABLE_SCHEDULE:
        return (
            <TimetableComponent 
                timetable={timetable} 
                cart={plan.cart || []} 
                onAddSession={addSessionRow}
                onDragEnd={(res) => onDragEnd(res, plan.cart || [])}
            />
        );
      case STAGES.COST_ESTIMATION:
        return <CostEstimationComponent costEstimation={sampleCosts} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full font-body">
        <div className="mb-4 flex items-center gap-4">
            <Button icon={<ArrowLeftOutlined />} onClick={onBack} className="border-primary text-primary hover:text-primary-dark">Back to Plans</Button>
            <Title level={3} style={{ margin: 0 }} className="font-heading !text-text">{plan.title}</Title>
        </div>
        
        <Row style={{ marginBottom: '16px' }} gutter={16}>
        <Col span={6}><Button block type={currentStage === STAGES.MAP_SELECTION ? 'primary' : 'default'} onClick={() => setCurrentStage(STAGES.MAP_SELECTION)} className={currentStage === STAGES.MAP_SELECTION ? 'bg-primary' : ''}>1. Map Selection</Button></Col>
        <Col span={6}><Button block type={currentStage === STAGES.FLIGHT_INFO ? 'primary' : 'default'} onClick={() => setCurrentStage(STAGES.FLIGHT_INFO)} className={currentStage === STAGES.FLIGHT_INFO ? 'bg-primary' : ''}>2. Flight Info</Button></Col>
        <Col span={6}><Button block type={currentStage === STAGES.TIMETABLE_SCHEDULE ? 'primary' : 'default'} onClick={() => setCurrentStage(STAGES.TIMETABLE_SCHEDULE)} className={currentStage === STAGES.TIMETABLE_SCHEDULE ? 'bg-primary' : ''}>3. Timetable Schedule</Button></Col>
        <Col span={6}><Button block type={currentStage === STAGES.COST_ESTIMATION ? 'primary' : 'default'} onClick={() => setCurrentStage(STAGES.COST_ESTIMATION)} className={currentStage === STAGES.COST_ESTIMATION ? 'bg-primary' : ''}>4. Cost Estimation</Button></Col>
        </Row>
        
        <div className="flex-1 overflow-hidden">
        {renderCurrentStage()}
        </div>
    </div>
  );
};

export default PlanEditor;
