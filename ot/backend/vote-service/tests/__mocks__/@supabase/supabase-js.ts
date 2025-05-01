export const mockGetUser = jest.fn();
export const mockEq = jest.fn();
export const mockIn = jest.fn();
export const mockGte = jest.fn();
export const mockSingle = jest.fn();

export const mockSelect = jest.fn(() => ({
  eq: mockEq,
  in: mockIn,
  gte: mockGte,
  single: mockSingle,
}));

export const mockInsert = jest.fn(() => ({
  select: mockSelect,
}));

export const createClient = jest.fn().mockImplementation(() => ({
  auth: {
    getUser: mockGetUser,
  },
  from: jest.fn(() => ({
    insert: mockInsert,
    select: mockSelect,
  })),
}));
