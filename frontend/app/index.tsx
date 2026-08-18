import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function IndexScreen() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return <Redirect href={isAuthenticated ? '/(tabs)/home' : '/welcome'} />;
}
