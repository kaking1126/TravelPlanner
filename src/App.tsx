import React, { useState } from 'react';
import { ConfigProvider, Layout, Button, Space, Card, List, Modal, Row, Col } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import Map from './components/Map';
import SpotDetails from './components/SpotDetails';
import { TravelSpot } from './spots';
import TimetableComponent from './components/Timetable';
import { sampleTimetable } from './sampleTimetable';
import CostEstimationComponent from './components/CostEstimation';
import { sampleCosts } from './sampleCosts';
import NotificationsPage from './components/NotificationsPage';
import FlightInfo from './components/FlightInfo';
import { FlightDetails } from './timetable';

const { Header, Content, Sider } = Layout;

const STAGES = {
  MAP_SELECTION: 'Map Selection',
  FLIGHT_INFO: 'Flight Info',
  TIMETABLE_SCHEDULE: 'Timetable Schedule',
  COST_ESTIMATION: 'Cost Estimation',
};

function App() {
  const [currentStage, setCurrentStage] = useState(STAGES.MAP_SELECTION);
  const [selectedSpot, setSelectedSpot] = useState<TravelSpot | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [flightInfo, setFlightInfo] = useState<{ arrival: FlightDetails, departure: FlightDetails } | null>(null);
  const [cart, setCart] = useState<TravelSpot[]>([]);

  const handleSelectSpot = (spot: TravelSpot) => {
    setSelectedSpot(spot);
  };

  const handleAddToCart = (spot: TravelSpot) => {
    setCart([...cart, spot]);
  };

  const handleFlightInfoSubmit = (info: { arrival: FlightDetails, departure: FlightDetails }) => {
    setFlightInfo(info);
    setCurrentStage(STAGES.TIMETABLE_SCHEDULE);
  };

  const renderCurrentStage = () => {
    switch (currentStage) {
      case STAGES.MAP_SELECTION:
        return (
          <Layout style={{ height: 'calc(100vh - 128px)' }}>
            <Content>
              <Map onSelectSpot={handleSelectSpot} />
            </Content>
            <Sider width={300} theme="light" style={{ overflow: 'auto' }}>
              {selectedSpot ? <SpotDetails spot={selectedSpot} onAddToCart={handleAddToCart} /> : <div className="p-4">Select a spot to see details</div>}
            </Sider>
            <Sider width={300} theme="light" style={{ overflow: 'auto', borderLeft: '1px solid #f0f0f0' }}>
              <Card title="Cart">
                <List
                  dataSource={cart}
                  renderItem={item => (
                    <List.Item>
                      <Card
                        hoverable
                        size="small"
                        cover={<img alt={item.name} src={item.imageUrl} />}
                      >
                        <Card.Meta title={item.name} />
                      </Card>
                    </List.Item>
                  )}
                />
              </Card>
            </Sider>
          </Layout>
        );
      case STAGES.FLIGHT_INFO:
        return <FlightInfo onFlightInfoSubmit={handleFlightInfoSubmit} />;
      case STAGES.TIMETABLE_SCHEDULE:
        return <TimetableComponent flightInfo={flightInfo} cart={cart} />;
      case STAGES.COST_ESTIMATION:
        return <CostEstimationComponent costEstimation={sampleCosts} />;
      default:
        return null;
    }
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#4F46E5' } }}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header className="bg-primary flex justify-between items-center">
          <h1 className="text-white text-2xl">Travel Planner</h1>
          <Button type="primary" icon={<BellOutlined />} onClick={() => setShowNotifications(true)}>
            Notifications
          </Button>
        </Header>
        <Modal
          title="Notifications"
          open={showNotifications}
          onCancel={() => setShowNotifications(false)}
          footer={null}
        >
          <NotificationsPage onClose={() => setShowNotifications(false)} />
        </Modal>
        <Content style={{ padding: '0 50px' }}>
          <Row style={{ margin: '16px 0' }}>
            <Col span={6}><Button block type={currentStage === STAGES.MAP_SELECTION ? 'primary' : 'default'} onClick={() => setCurrentStage(STAGES.MAP_SELECTION)}>1. Map Selection</Button></Col>
            <Col span={6}><Button block type={currentStage === STAGES.FLIGHT_INFO ? 'primary' : 'default'} onClick={() => setCurrentStage(STAGES.FLIGHT_INFO)}>2. Flight Info</Button></Col>
            <Col span={6}><Button block type={currentStage === STAGES.TIMETABLE_SCHEDULE ? 'primary' : 'default'} onClick={() => setCurrentStage(STAGES.TIMETABLE_SCHEDULE)}>3. Timetable Schedule</Button></Col>
            <Col span={6}><Button block type={currentStage === STAGES.COST_ESTIMATION ? 'primary' : 'default'} onClick={() => setCurrentStage(STAGES.COST_ESTIMATION)}>4. Cost Estimation</Button></Col>
          </Row>
          <div>
            {renderCurrentStage()}
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
