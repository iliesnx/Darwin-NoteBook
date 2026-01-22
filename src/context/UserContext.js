import React, { createContext, useState } from 'react';
import { MOCK_USER_PROFILE } from '../data/mockUserProfile';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(MOCK_USER_PROFILE); // on remplace MOCK_USER_PROFILE par null pour gerer le cas ou y'a pas d'utilisateur connecté

  // Pour modifier le solde tokens de l'utilisateur
  const updateTokens = (delta) => {
    setProfile(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        bioTokens: prev.stats.bioTokens + delta
      }
    }));
  };

  return (
    <UserContext.Provider value={{ profile, setProfile, updateTokens }}>
      {children}
    </UserContext.Provider>
  );
};