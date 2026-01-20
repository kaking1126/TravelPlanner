import React, { useState } from 'react';
import { Layout, Button, Card, List, Row, Col, Typography, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import GlobeSelector from './GlobeSelector';
import CityDetailMap from './CityDetailMap';
import { TravelSpot, travelSpots } from '../spots';
import { City } from '../cities';
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
  
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const filteredSpots = selectedCity 
    ? travelSpots.filter(s => s.cityId === selectedCity.id) 
    : [];
  
  const handleAddToCart = (spot: TravelSpot) => {
    const currentCart = plan.cart || [];
    if (currentCart.some(item => item.id === spot.id)) {
        message.warning(`${spot.name} is already in your plan.`);
        return;
    }
    const newCart = [...currentCart, spot];
    onUpdatePlan({ ...plan, cart: newCart });
    message.success(`${spot.name} added to plan!`);
  };

  const { timetable, generateTimetableFromFlight, addSessionRow, updateActivity, onDragEnd } = useTimetableViewModel(
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
            <Content className="overflow-y-auto">
               <div className="p-4">
                  <GlobeSelector onSelectCity={setSelectedCity} />
               </div>

               <div className="flex h-[600px] border-t border-border">
                  <div className="w-2/3 p-4">
                      <CityDetailMap 
                        selectedCity={selectedCity} 
                        spots={filteredSpots} 
                        onSelectSpot={(spot) => {
                            setSelectedSpot(spot);
                            handleAddToCart(spot);
                        }} 
                      />
                  </div>
                  <div className="w-1/3 bg-white p-4 overflow-y-auto border-l border-border">
                      <Title level={4} className="font-heading !text-primary mb-4">
                        {selectedCity ? `Spots in ${selectedCity.name}` : 'Select a City'}
                      </Title>
                      
                      {selectedCity ? (
                        <div className="grid gap-4">
                            {filteredSpots.map(spot => (
                                <Card 
                                    key={spot.id}
                                    hoverable
                                    size="small"
                                    cover={<img alt={spot.name} src={spot.imageUrl} className="h-32 object-cover" />}
                                    onClick={() => setSelectedSpot(spot)}
                                    className={`border-border ${selectedSpot?.id === spot.id ? 'border-primary ring-2 ring-primary/20' : ''}`}
                                    actions={[
                                        <Button type="link" onClick={() => handleAddToCart(spot)}>Add to Plan</Button>
                                    ]}
                                >
                                    <Card.Meta title={spot.name} description={<span className="line-clamp-2">{spot.description}</span>} />
                                </Card>
                            ))}
                            {filteredSpots.length === 0 && <p className="text-gray-500">No popular spots listed for this city yet.</p>}
                        </div>
                      ) : (
                          <div className="text-center py-10 text-gray-400">
                             Use the globe above to select a destination city.
                          </div>
                      )}
                  </div>
               </div>
            </Content>
            
            <Sider width={250} theme="light" style={{ overflow: 'auto', borderLeft: '1px solid #E2E8F0', padding: '10px' }} className="bg-surface">
              <Title level={5} className="!text-primary font-heading">Your Selection</Title>
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
        return <FlightInfo onFlightInfoSubmit={handleFlightInfoSubmit} initialDestination={selectedCity?.name} />;
      case STAGES.TIMETABLE_SCHEDULE:
        return (
            <TimetableComponent 
                timetable={timetable} 
                cart={plan.cart || []} 
                onAddSession={addSessionRow}
                onUpdateActivity={updateActivity}
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
        <Col span={6}><Button block type={currentStage === STAGES.MAP_SELECTION ? 'primary' : 'default'} onClick={() => setCurrentStage(STAGES.MAP_SELECTION)} className={currentStage === STAGES.MAP_SELECTION ? 'bg-primary' : ''}>1. Destination</Button></Col>
        <Col span={6}><Button block type={currentStage === STAGES.FLIGHT_INFO ? 'primary' : 'default'} onClick={() => setCurrentStage(STAGES.FLIGHT_INFO)} className={currentStage === STAGES.FLIGHT_INFO ? 'bg-primary' : ''}>2. Flights</Button></Col>
        <Col span={6}><Button block type={currentStage === STAGES.TIMETABLE_SCHEDULE ? 'primary' : 'default'} onClick={() => setCurrentStage(STAGES.TIMETABLE_SCHEDULE)} className={currentStage === STAGES.TIMETABLE_SCHEDULE ? 'bg-primary' : ''}>3. Schedule</Button></Col>
        <Col span={6}><Button block type={currentStage === STAGES.COST_ESTIMATION ? 'primary' : 'default'} onClick={() => setCurrentStage(STAGES.COST_ESTIMATION)} className={currentStage === STAGES.COST_ESTIMATION ? 'bg-primary' : ''}>4. Costs</Button></Col>
        </Row>
        
        <div className="flex-1 overflow-hidden">
        {renderCurrentStage()}
        </div>
    </div>
  );
};

export default PlanEditor;
