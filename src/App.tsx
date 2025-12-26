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
import SituationAI from "./components/SituationAI";

type Page = 'home' | 'survey' | 'situation' | 'result' | 'about' | 'contact' | 'reviews' | 'handbook' | 'auth' | 'dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [surveyId, setSurveyId] = useState<string>('');

  const handleStartSurvey = () => {
    setCurrentPage('survey');
  };

  const handleSurveyComplete = (id: string) => {
    setSurveyId(id);
    setCurrentPage('situation');
  };
  
  const handleSituationComplete = () => {
    setCurrentPage('result'); // chuyển sang phần kết quả
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
        {currentPage === 'situation' && (
          <SituationAI
            surveyId={surveyId}
            onBack={() => setCurrentPage('home')}
            onComplete={() => setCurrentPage('result')}
          />
        )}
        {currentPage === 'result' && (
          <Result surveyId={surveyId} onBackHome={() => setCurrentPage('home')} />
        )}
        {currentPage === 'about' && <About />}
        {currentPage === 'handbook' && <Handbook onNavigate={handleNavigate} />}
        {currentPage === 'contact' && <Contact />}
        {currentPage === 'reviews' && <Reviews />}
        {currentPage === 'dashboard' && <Dashboard />}

        <Chatbot />
      </div>
    </AuthProvider>
  );
}

export default App;
