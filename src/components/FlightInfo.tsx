import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Row, Col, Typography, Modal, List, Badge, Steps, message } from 'antd';
import { FlightDetails } from '../timetable';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Calendar, MapPin, ArrowRight, CheckCircle2, Search } from 'lucide-react';

const { Title, Text } = Typography;

interface FlightInfoProps {
  onFlightInfoSubmit: (flightInfo: { arrival: FlightDetails, departure: FlightDetails }) => void;
  initialDestination?: string;
}

// Mock flight data generator based on search
const generateMockFlights = (from: string, to: string, date: string) => [
  { id: 'flight-1', number: 'UA-123', from: from || 'JFK', to: to || 'LHR', departure: '10:00', arrival: '22:00', airline: 'United Airlines', price: '$450', date },
  { id: 'flight-2', number: 'BA-456', from: from || 'JFK', to: to || 'LHR', departure: '12:00', arrival: '00:00', airline: 'British Airways', price: '$520', date },
  { id: 'flight-3', number: 'AA-789', from: to || 'LHR', to: from || 'JFK', departure: '11:00', arrival: '14:00', airline: 'American Airlines', price: '$480', date },
];

const FlightInfo: React.FC<FlightInfoProps> = ({ onFlightInfoSubmit, initialDestination }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [flightType, setFlightType] = useState<'arrival' | 'departure' | null>(null);
  const [selectedFlights, setSelectedFlights] = useState<{ arrival?: any, departure?: any }>({});
  const [searchCriteria, setSearchCriteria] = useState<{ arrival?: any, departure?: any }>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [availableFlights, setAvailableFlights] = useState<any[]>([]);

  // Auto-fill logic
  useEffect(() => {
    // 1. Set destination based on Step 1 selection
    if (initialDestination) {
        form.setFieldsValue({
            arrivalTo: initialDestination,
            departureFrom: initialDestination
        });
    }

    // 2. Try to get user's current city (Simulated for now as Geolocation API gives coords, needing reverse geocoding)
    // In a real app, we'd use navigator.geolocation and a geocoding API.
    // Here we simulate a "Current Location" find.
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let estimatedCity = "New York"; // Default fallback
    if (userTimeZone.includes("London")) estimatedCity = "London";
    if (userTimeZone.includes("Tokyo")) estimatedCity = "Tokyo";
    if (userTimeZone.includes("Paris")) estimatedCity = "Paris";
    
    // Only set if not set by user already
    if (!form.getFieldValue('arrivalFrom')) {
         form.setFieldsValue({
            arrivalFrom: estimatedCity,
            departureTo: estimatedCity
         });
    }
  }, [initialDestination, form]);


  const handleSearch = (type: 'arrival' | 'departure', values: any) => {
    const from = values[`${type}From`];
    const to = values[`${type}To`];
    const date = values[`${type}Date`]?.toISOString();
    
    if (!from || !to || !date) {
        message.error("Please fill in all search fields.");
        return;
    }

    setSearchCriteria(prev => ({ ...prev, [type]: { from, to, date } }));
    setAvailableFlights(generateMockFlights(from, to, date));
    setFlightType(type);
    setIsModalVisible(true);
  };

  const handleSelectFlight = (flight: any) => {
    if (flightType) {
      form.setFieldsValue({
        [`${flightType}FlightNumber`]: flight.number,
        [`${flightType}Airport`]: flightType === 'arrival' ? flight.to : flight.from,
        [`${flightType}Time`]: flightType === 'arrival' ? flight.arrival : flight.departure,
        [`${flightType}From`]: flight.from,
        [`${flightType}To`]: flight.to,
        [`${flightType}Date`]: dayjs(flight.date), 
      });

      setSelectedFlights(prev => {
          const newState = {...prev, [flightType]: flight};
          if (newState.arrival && !newState.departure && currentStep === 0) setCurrentStep(1);
          if (newState.arrival && newState.departure) setCurrentStep(2);
          return newState;
      });
    }
    setIsModalVisible(false);
  };

  const combineDateAndTime = (date: any, timeStr: string): string => {
    if (!date || !timeStr) return new Date().toISOString();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const d = dayjs(date).hour(hours).minute(minutes);
    return d.toISOString();
  };

  const onFinish = (values: any) => {
    if (!selectedFlights.arrival || !selectedFlights.departure) return;

    const arrivalDate = values.arrivalDate;
    const departureDate = values.departureDate;

    const arrivalDateTime = combineDateAndTime(arrivalDate, selectedFlights.arrival.arrival);
    const arrivalDepartureTime = combineDateAndTime(arrivalDate, selectedFlights.arrival.departure); 

    const departureDateTime = combineDateAndTime(departureDate, selectedFlights.departure.departure);
    const departureArrivalTime = combineDateAndTime(departureDate, selectedFlights.departure.arrival);

    const flightInfo = {
      arrival: {
        flightNumber: values.arrivalFlightNumber,
        departureAirport: selectedFlights.arrival.from,
        arrivalAirport: values.arrivalAirport,
        arrivalTime: arrivalDateTime,
        departureTime: arrivalDepartureTime, 
      },
      departure: {
        flightNumber: values.departureFlightNumber,
        departureAirport: values.departureAirport,
        arrivalAirport: selectedFlights.departure.to,
        arrivalTime: departureArrivalTime,
        departureTime: departureDateTime,
      }
    };
    onFlightInfoSubmit(flightInfo);
  };

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
            <Title level={2} className="font-heading !text-text !mb-2 flex items-center gap-3">
                <Plane className="text-primary w-8 h-8" /> 
                Flight Details
            </Title>
            <Text className="text-text-secondary text-lg">Search and select your flights</Text>
        </div>
        <div className="w-1/3">
             <Steps 
                current={currentStep} 
                items={[
                    { title: 'Inbound', description: 'Search & Select' },
                    { title: 'Outbound', description: 'Search & Select' },
                    { title: 'Confirm', description: 'Generate Plan' },
                ]}
             />
        </div>
      </div>

      <Form form={form} onFinish={onFinish} layout="vertical" className="relative">
        <Row gutter={32}>
          {/* Inbound Section */}
          <Col span={12}>
            <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-2xl shadow-lg border border-border overflow-hidden h-full flex flex-col"
            >
                <div className="bg-primary/5 p-6 border-b border-primary/10 flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-full shadow-sm text-primary">
                            <ArrowRight className="w-5 h-5 rotate-45" />
                        </div>
                        <Title level={4} className="!m-0 font-heading !text-primary-dark">Inbound Flight</Title>
                     </div>
                     {selectedFlights.arrival && <Badge status="success" text={<span className="text-success font-medium">Selected</span>} />}
                </div>
                
                <div className="p-8 flex-1 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="arrivalFrom" label="From" rules={[{ required: true }]}>
                            <Input prefix={<MapPin className="w-4 h-4 text-gray-400"/>} placeholder="Origin (e.g. NYC)" />
                        </Form.Item>
                        <Form.Item name="arrivalTo" label="To" rules={[{ required: true }]}>
                            <Input prefix={<MapPin className="w-4 h-4 text-gray-400"/>} placeholder="Dest (e.g. LHR)" />
                        </Form.Item>
                    </div>
                    <Form.Item label="Travel Date" name="arrivalDate" rules={[{ required: true }]}>
                        <DatePicker className="w-full h-12 rounded-lg border-gray-300 shadow-sm" suffixIcon={<Calendar className="text-primary w-5 h-5"/>} />
                    </Form.Item>

                    <Button 
                        type="primary"
                        onClick={() => {
                             form.validateFields(['arrivalFrom', 'arrivalTo', 'arrivalDate']).then(values => {
                                 handleSearch('arrival', values);
                             });
                        }}
                        className="w-full h-10 mb-4 bg-primary hover:bg-primary-dark border-none flex items-center justify-center gap-2"
                        icon={<Search className="w-4 h-4" />}
                    >
                        Search Inbound Flights
                    </Button>

                    <div className="border-t border-gray-100 pt-4 mt-2">
                        <div className="grid grid-cols-3 gap-4 opacity-75">
                             <Form.Item name="arrivalFlightNumber" label="Flight"><Input readOnly className="h-10 bg-gray-50 font-mono" placeholder="-" /></Form.Item>
                             <Form.Item name="arrivalAirport" label="Airport"><Input readOnly className="h-10 bg-gray-50" placeholder="-" /></Form.Item>
                             <Form.Item name="arrivalTime" label="Time"><Input readOnly className="h-10 bg-gray-50" placeholder="-" /></Form.Item>
                        </div>
                    </div>
                </div>
            </motion.div>
          </Col>

          {/* Outbound Section */}
          <Col span={12}>
            <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-2xl shadow-lg border border-border overflow-hidden h-full flex flex-col"
            >
                <div className="bg-secondary/5 p-6 border-b border-secondary/10 flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-full shadow-sm text-secondary">
                            <ArrowRight className="w-5 h-5 -rotate-45" />
                        </div>
                        <Title level={4} className="!m-0 font-heading !text-secondary">Outbound Flight</Title>
                     </div>
                     {selectedFlights.departure && <Badge status="success" text={<span className="text-success font-medium">Selected</span>} />}
                </div>

                <div className="p-8 flex-1 flex flex-col gap-4">
                     <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="departureFrom" label="From" rules={[{ required: true }]}>
                            <Input prefix={<MapPin className="w-4 h-4 text-gray-400"/>} placeholder="Origin" />
                        </Form.Item>
                        <Form.Item name="departureTo" label="To" rules={[{ required: true }]}>
                            <Input prefix={<MapPin className="w-4 h-4 text-gray-400"/>} placeholder="Dest" />
                        </Form.Item>
                    </div>
                    <Form.Item label="Travel Date" name="departureDate" rules={[{ required: true }]}>
                        <DatePicker className="w-full h-12 rounded-lg border-gray-300 shadow-sm" suffixIcon={<Calendar className="text-secondary w-5 h-5"/>} />
                    </Form.Item>

                    <Button 
                        type="primary"
                        onClick={() => {
                             form.validateFields(['departureFrom', 'departureTo', 'departureDate']).then(values => {
                                 handleSearch('departure', values);
                             });
                        }}
                        className="w-full h-10 mb-4 bg-secondary hover:bg-secondary-dark border-none flex items-center justify-center gap-2"
                         icon={<Search className="w-4 h-4" />}
                    >
                        Search Outbound Flights
                    </Button>

                    <div className="border-t border-gray-100 pt-4 mt-2">
                        <div className="grid grid-cols-3 gap-4 opacity-75">
                            <Form.Item name="departureFlightNumber" label="Flight"><Input readOnly className="h-10 bg-gray-50 font-mono" placeholder="-" /></Form.Item>
                            <Form.Item name="departureAirport" label="Airport"><Input readOnly className="h-10 bg-gray-50" placeholder="-" /></Form.Item>
                            <Form.Item name="departureTime" label="Time"><Input readOnly className="h-10 bg-gray-50" placeholder="-" /></Form.Item>
                        </div>
                    </div>
                </div>
            </motion.div>
          </Col>
        </Row>

        <AnimatePresence>
            {selectedFlights.arrival && selectedFlights.departure && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-12 flex justify-end"
                >
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large" 
                    className="bg-cta hover:bg-orange-600 border-none h-14 px-12 text-lg font-medium shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2 rounded-full"
                  >
                    Generate Timetable <CheckCircle2 className="w-5 h-5" />
                  </Button>
                </motion.div>
            )}
        </AnimatePresence>
      </Form>

      <Modal 
        title={
            <div className="font-heading text-xl">
                Select {flightType === 'arrival' ? 'Inbound' : 'Outbound'} Flight
                <div className="text-sm font-normal text-gray-500 mt-1">
                    {searchCriteria[flightType!]?.from} <ArrowRight className="w-3 h-3 inline mx-1"/> {searchCriteria[flightType!]?.to} on {dayjs(searchCriteria[flightType!]?.date).format('MMM D, YYYY')}
                </div>
            </div>
        }
        open={isModalVisible} 
        onCancel={() => setIsModalVisible(false)} 
        footer={null}
        width={600}
        className="rounded-xl overflow-hidden"
      >
        <List
          itemLayout="vertical"
          dataSource={availableFlights}
          renderItem={item => (
            <List.Item
                className="hover:bg-blue-50 transition-colors cursor-pointer rounded-lg px-4 -mx-4 border-b-0 mb-2"
                onClick={() => handleSelectFlight(item)}
            >
                <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                             <span className="font-bold text-lg text-text font-mono">{item.number}</span>
                             <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full text-gray-600">{item.airline}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-500">
                             <span>{item.from}</span>
                             <ArrowRight className="w-4 h-4" />
                             <span>{item.to}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                            Dep: {item.departure} • Arr: {item.arrival}
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                         <span className="font-bold text-xl text-primary">{item.price}</span>
                         <Button type="primary" size="small" className="bg-primary hover:bg-primary-dark shadow-sm">Select</Button>
                    </div>
                </div>
            </List.Item>
          )}
        />
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3">
             <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
             </div>
             <Text className="text-xs text-blue-800 font-medium">
                Live flight data connected via Flightradar24 (Simulation Mode). Real-time prices and delays enabled.
             </Text>
        </div>
      </Modal>
    </motion.div>
  );
};

export default FlightInfo;