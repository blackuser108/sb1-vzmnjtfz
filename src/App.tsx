import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Survey from './pages/Survey';
import Result from './pages/Result';
import About from './pages/About';
import Contact from './pages/Contact';
import Reviews from './pages/Reviews';
import Handbook from './pages/Handbook';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import DailyTasks from './pages/DailyTasks';
import ResearchPaper from './pages/ResearchPaper';

type Page = 'home' | 'survey' | 'result' | 'about' | 'contact' | 'reviews' | 'handbook' | 'auth' | 'dashboard' | 'dailytasks' | 'research';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [surveyId, setSurveyId] = useState<string>('');

  const handleStartSurvey = () => {
    setCurrentPage('survey');
  };

  const handleSurveyComplete = (id: string) => {
    setSurveyId(id);
    setCurrentPage('result');
  };

  const handleBackHome = () => {
    setCurrentPage('home');
  };

  const handleBackFromSurvey = () => {
    setCurrentPage('home');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        {currentPage !== 'survey' && currentPage !== 'result' && currentPage !== 'auth' && (
          <Header currentPage={currentPage} onNavigate={handleNavigate} />
        )}

        {currentPage === 'home' && <Home onStartSurvey={handleStartSurvey} />}
        {currentPage === 'auth' && (
          <Auth
            onSuccess={() => setCurrentPage('home')}
            onBack={() => setCurrentPage('home')}
          />
        )}
        {currentPage === 'survey' && (
          <Survey onComplete={handleSurveyComplete} onBack={handleBackFromSurvey} />
        )}
        {currentPage === 'result' && (
          <Result surveyId={surveyId} onBackHome={() => setCurrentPage('home')} />
        )}
        {currentPage === 'about' && <About />}
        {currentPage === 'handbook' && <Handbook onNavigate={handleNavigate} />}
        {currentPage === 'research' && <ResearchPaper />}
        {currentPage === 'contact' && <Contact />}
        {currentPage === 'reviews' && <Reviews />}
        {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
        {currentPage === 'dailytasks' && <DailyTasks onNavigate={handleNavigate} />}

        <Chatbot />
      </div>
    </AuthProvider>
  );
}

export default App;
