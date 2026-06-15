import React from 'react';
import { RegisterForm } from 'features/auth';

export default function Register() {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 120px)', alignItems: 'center', justifyContent: 'center' }}>
      <RegisterForm />
    </div>
  );
}
