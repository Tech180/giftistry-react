import React from 'react';
import { LoginForm } from 'features/auth';

export default function Login() {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 120px)', alignItems: 'center', justifyContent: 'center' }}>
      <LoginForm />
    </div>
  );
}
