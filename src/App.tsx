import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ChatArea } from './components/ChatArea/ChatArea';
import { ApiKeyModal } from './components/Modals/ApiKeyModal';
import { useStore } from './store';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const { hasApiKey, setHasApiKey } = useStore();
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  useEffect(() => {
    // Check if API key exists in local storage
    const apiKey = localStorage.getItem('api_key');
    if (apiKey) {
      setHasApiKey(true);
    } else {
      setShowApiKeyModal(true);
    }
  }, [setHasApiKey]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <ThemeProvider>
      <div className="flex h-full bg-white dark:bg-gray-900 transition-colors duration-200">
        <Sidebar isVisible={showSidebar} toggleVisibility={toggleSidebar} />
        <ChatArea 
          sidebarVisible={showSidebar}
          toggleSidebar={toggleSidebar}
        />
        
        {showApiKeyModal && !hasApiKey && (
          <ApiKeyModal 
            onClose={() => setShowApiKeyModal(false)} 
            onSave={() => {
              setHasApiKey(true);
              setShowApiKeyModal(false);
            }}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;