import { Outlet } from 'react-router-dom';
import JourneyBar from './JourneyBar';

export default function AppLayout() {
  return (
    <>
      <JourneyBar />
      <Outlet />
    </>
  );
}
