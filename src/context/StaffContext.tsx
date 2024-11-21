import React, { createContext, useContext, useState, useEffect } from 'react';

interface StaffType {
  StaffType_ID: number;
  Title: string;
  Title_Code: string;
}

interface StaffContextType {
  staffTypes: StaffType[];
  addStaffType: (staffType: StaffType) => void;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export function StaffProvider({ children }: { children: React.ReactNode }) {
  const [staffTypes, setStaffTypes] = useState<StaffType[]>([
    { StaffType_ID: 1, Title: "Registered Nurse", Title_Code: "RN" },
    { StaffType_ID: 2, Title: "Licensed Practical Nurse", Title_Code: "LPN" },
    { StaffType_ID: 3, Title: "Certified Nursing Assistant", Title_Code: "CNA" },
    { StaffType_ID: 4, Title: "Unit Coordinator", Title_Code: "UC" },
    { StaffType_ID: 5, Title: "Medical Assistant", Title_Code: "MA" }
  ]);

  const addStaffType = (staffType: StaffType) => {
    setStaffTypes(prev => [...prev, staffType]);
  };

  return (
    <StaffContext.Provider value={{ staffTypes, addStaffType }}>
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
}