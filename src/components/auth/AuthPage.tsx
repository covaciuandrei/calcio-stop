import React, { useEffect, useState } from 'react';
import { useSystemStore } from '../../stores/systemStore';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { registrationEnabled, loadSettings } = useSystemStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const switchToLogin = () => setIsLogin(true);
  const switchToRegister = () => setIsLogin(false);

  return (
    <>
      {isLogin ? (
        <LoginForm
          onSwitchToRegister={registrationEnabled ? switchToRegister : undefined}
          showRegisterLink={registrationEnabled}
        />
      ) : (
        <RegisterForm onSwitchToLogin={switchToLogin} />
      )}
    </>
  );
};
