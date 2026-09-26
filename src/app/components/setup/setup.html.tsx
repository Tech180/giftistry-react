import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoadingState } from 'shared/ui';

const SetupPage = lazy(() =>
  import('../../pages/setup/setup.component').then((module) => ({ default: module.Setup }))
);

export const SetupTemplate: React.FC = () => {
  return (
    <Suspense
      fallback = {
        <LoadingState
          message = {
            'Loading...'
          }
          viewport
        />
      }
    >
      <Routes>
        <Route
          path = {
            '/setup'
          }
          element = {
            <SetupPage />
          }
        />
        <Route
          path = {
            '*'
          }
          element = {
            <Navigate
              to = {
                '/setup'
              }
              replace
            />
          }
        />
      </Routes>
    </Suspense>
  );
};
