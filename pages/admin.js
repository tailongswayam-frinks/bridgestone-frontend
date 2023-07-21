import Admin from 'components/AdminUpdate';
import WhatsappRecipient from 'components/WhatsAppRecipient';
import Layout from 'components/Layout';
import Container from 'styles/homepage.styles';
import { useState } from 'react';
import Parameters from 'components/Parameters';
import Belts from 'components/Belts';

function DashboardComponent({ activeSection }) {
  // console.log(handleBeltReset);
  if (activeSection === 0) {
    return <Admin />;
  }
  if (activeSection === 1) {
    return <WhatsappRecipient />;
  }
  if (activeSection === 2) {
    return <Parameters />;
  }
  if (activeSection === 3) {
    return <Belts />;
  }
}

function Index() {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <>
      <Layout style={{ marginTop: '100px' }}>
        <Container>
          <div className="trackbar">
            <div
              className={`option ${activeSection === 0 ? 'active' : ''}`}
              onClick={() => setActiveSection(0)}
              onKeyPress={() => setActiveSection(0)}
              role="button"
              tabIndex={0}
            >
              <h6 style={{ textAlign: 'center' }}>System Configuration</h6>
            </div>
            <div
              className={`option ${activeSection === 1 ? 'active' : ''}`}
              onClick={() => setActiveSection(1)}
              onKeyPress={() => setActiveSection(1)}
              role="button"
              tabIndex={0}
            >
              <h6 style={{ textAlign: 'center' }}>WhatsApp Recipient</h6>
            </div>
            <div
              className={`option ${activeSection === 2 ? 'active' : ''}`}
              onClick={() => setActiveSection(2)}
              onKeyPress={() => setActiveSection(2)}
              role="button"
              tabIndex={0}
            >
              <h6 style={{ textAlign: 'center' }}>Parameters</h6>
            </div>
            <div
              className={`option ${activeSection === 3 ? 'active' : ''}`}
              onClick={() => setActiveSection(3)}
              onKeyPress={() => setActiveSection(3)}
              role="button"
              tabIndex={0}
            >
              <h6 style={{ textAlign: 'center' }}>Belts</h6>
            </div>
          </div>
          <DashboardComponent activeSection={activeSection} />
        </Container>
      </Layout>
    </>
  );
}

export default Index;
