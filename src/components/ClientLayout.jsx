'use client';
import ReduxProvider from './ReduxProvider';

export default function ClientLayout({ children }) {
  return <ReduxProvider>{children}</ReduxProvider>;
}