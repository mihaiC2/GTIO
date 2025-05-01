export const mockGetUser = jest.fn();
export const mockEq = jest.fn();
export const mockIn = jest.fn();
export const mockSingle = jest.fn();
export const mockDelete = jest.fn();

export const mockSelect = jest.fn(() => ({
  eq: mockEq,
  in: mockIn,
  single: mockSingle,
}));

export const mockInsert = jest.fn(() => ({
  select: mockSelect,
}));

export const mockFrom = jest.fn(() => ({
  insert: mockInsert,
  select: mockSelect,
}));

export const createClient = jest.fn().mockImplementation(() => ({
  auth: {
    getUser: mockGetUser,
  },
  from: mockFrom,
}));
