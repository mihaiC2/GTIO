const mockGetUser = jest.fn();
const mockEq = jest.fn();
const mockIn = jest.fn();
const mockGte = jest.fn();
const mockSingle = jest.fn();

const mockSelect = jest.fn(() => ({
  eq: mockEq,
  in: mockIn,
  gte: mockGte,
  single: mockSingle,
}));

const mockInsert = jest.fn(() => ({
  select: mockSelect,
}));

export {
  mockGetUser,
  mockEq,
  mockIn,
  mockGte,
  mockSingle,
  mockSelect,
  mockInsert,
};

export const createClient = jest.fn().mockImplementation(() => ({
  auth: {
    getUser: mockGetUser,
  },
  from: jest.fn(() => ({
    insert: mockInsert,
    select: mockSelect,
  })),
}));
