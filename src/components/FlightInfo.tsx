import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Row, Col, Typography, Modal, List } from 'antd';
import { FlightDetails } from '../timetable';

const { Title } = Typography;

interface FlightInfoProps {
  onFlightInfoSubmit: (flightInfo: { arrival: FlightDetails, departure: FlightDetails }) => void;
}

// Mock flight data
const mockFlights = [
  { id: 'flight-1', number: 'UA-123', from: 'JFK', to: 'LHR', departure: '10:00 AM', arrival: '10:00 PM' },
  { id: 'flight-2', number: 'BA-456', from: 'JFK', to: 'LHR', departure: '12:00 PM', arrival: '12:00 AM' },
  { id: 'flight-3', number: 'AA-789', from: 'LHR', to: 'JFK', departure: '11:00 AM', arrival: '2:00 PM' },
];

const FlightInfo: React.FC<FlightInfoProps> = ({ onFlightInfoSubmit }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [flightType, setFlightType] = useState<'arrival' | 'departure' | null>(null);
  const [selectedFlights, setSelectedFlights] = useState<{ arrival?: any, departure?: any }>({});

  const showModal = (type: 'arrival' | 'departure') => {
    setFlightType(type);
    setIsModalVisible(true);
  };

  const handleSelectFlight = (flight: any) => {
    if (flightType) {
      form.setFieldsValue({
        [`${flightType}FlightNumber`]: flight.number,
        [`${flightType}Airport`]: flightType === 'arrival' ? flight.to : flight.from,
        [`${flightType}Time`]: flight.arrival,
      });
      setSelectedFlights(prev => ({...prev, [flightType]: flight}));
    }
    setIsModalVisible(false);
  };

  const onFinish = (values: any) => {
    const flightInfo = {
      arrival: {
        flightNumber: values.arrivalFlightNumber,
        departureAirport: selectedFlights.arrival.from,
        arrivalAirport: values.arrivalAirport,
        arrivalTime: new Date(values.arrivalTime),
        departureTime: new Date(),
      },
      departure: {
        flightNumber: values.departureFlightNumber,
        departureAirport: values.departureAirport,
        arrivalAirport: selectedFlights.departure.to,
        arrivalTime: new Date(),
        departureTime: new Date(values.departureTime),
      }
    };
    onFlightInfoSubmit(flightInfo);
  };

  return (
    <div className="p-6">
      <Title level={2} className="text-text-primary">Flight Information</Title>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Title level={4} className="text-text-secondary">Arrival Flight</Title>
            <Form.Item label="From / To">
              <Input.Group compact>
                <Form.Item name="arrivalFrom" noStyle rules={[{ required: true }]}><Input style={{ width: '50%' }} placeholder="From" /></Form.Item>
                <Form.Item name="arrivalTo" noStyle rules={[{ required: true }]}><Input style={{ width: '50%' }} placeholder="To" /></Form.Item>
              </Input.Group>
            </Form.Item>
            <Form.Item name="arrivalDate" label="Date" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Button type="primary" onClick={() => showModal('arrival')}>Search Arrival</Button>
            <Form.Item name="arrivalFlightNumber" label="Flight Number" style={{ marginTop: '16px'}}><Input readOnly /></Form.Item>
            <Form.Item name="arrivalAirport" label="Arrival Airport"><Input readOnly /></Form.Item>
            <Form.Item name="arrivalTime" label="Arrival Time"><Input readOnly /></Form.Item>
          </Col>
          <Col span={12}>
            <Title level={4} className="text-text-secondary">Departure Flight</Title>
            <Form.Item label="From / To">
              <Input.Group compact>
                <Form.Item name="departureFrom" noStyle rules={[{ required: true }]}><Input style={{ width: '50%' }} placeholder="From" /></Form.Item>
                <Form.Item name="departureTo" noStyle rules={[{ required: true }]}><Input style={{ width: '50%' }} placeholder="To" /></Form.Item>
              </Input.Group>
            </Form.Item>
            <Form.Item name="departureDate" label="Date" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Button type="primary" onClick={() => showModal('departure')}>Search Departure</Button>
            <Form.Item name="departureFlightNumber" label="Flight Number" style={{ marginTop: '16px'}}><Input readOnly /></Form.Item>
            <Form.Item name="departureAirport" label="Departure Airport"><Input readOnly /></Form.Item>
            <Form.Item name="departureTime" label="Departure Time"><Input readOnly /></Form.Item>
          </Col>
        </Row>
        <Form.Item style={{ marginTop: '24px' }}>
          <Button type="primary" htmlType="submit">
            Next
          </Button>
        </Form.Item>
      </Form>
      <Modal title="Select a Flight" open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <List
          dataSource={mockFlights}
          renderItem={item => (
            <List.Item
              actions={[<Button onClick={() => handleSelectFlight(item)}>Select</Button>]}
            >
              <List.Item.Meta
                title={`${item.number} (${item.from} -> ${item.to})`}
                description={`Departs: ${item.departure}, Arrives: ${item.arrival}`}
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default FlightInfo;
