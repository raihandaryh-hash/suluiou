import { Outlet } from 'react-router-dom';
import JourneyBar from '@/components/JourneyBar';
import RequireAuth from '@/components/RequireAuth';

export default function SpineBLayout() {
  return (
    <RequireAuth>
      <JourneyBar />
      <Outlet />
    </RequireAuth>
  );
}
