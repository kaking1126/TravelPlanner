import { useState } from 'react';
import { ConfigProvider, Layout, Button, Modal } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import NotificationsPage from './components/NotificationsPage';
import PlanList from './components/PlanList';
import PlanEditor from './components/PlanEditor';
import { usePlanListViewModel } from './viewmodels/usePlanListViewModel';
import { Plan } from './timetable';

const { Header, Content } = Layout;

function App() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { plans, addPlan, deletePlan, updatePlan } = usePlanListViewModel();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleBackToPlans = () => {
    setSelectedPlan(null);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3B82F6', // Blue 500
          colorText: '#0F172A',    // Slate 900
          fontFamily: 'Work Sans, sans-serif',
          colorBgLayout: '#F0F9FF',
        },
        components: {
            Button: {
                colorPrimary: '#3B82F6',
                algorithm: true,
            },
            Layout: {
                headerBg: '#3B82F6',
            }
        }
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Header className="bg-primary flex justify-between items-center px-6 shadow-md z-10">
          <h1 className="text-white text-2xl font-heading font-bold m-0 tracking-tight">Travel Planner Pro</h1>
          <Button type="primary" icon={<BellOutlined />} onClick={() => setShowNotifications(true)} className="bg-primary-dark border-primary-light hover:bg-primary-light shadow-sm">
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
        <Content style={{ padding: '24px 50px' }}>
          {selectedPlan ? (
            <PlanEditor 
                plan={selectedPlan} 
                onUpdatePlan={(p) => {
                    updatePlan(p);
                    setSelectedPlan(p); 
                }} 
                onBack={handleBackToPlans} 
            />
          ) : (
            <PlanList 
                plans={plans} 
                onAddPlan={addPlan} 
                onSelectPlan={handleSelectPlan} 
                onDeletePlan={deletePlan} 
            />
          )}
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;