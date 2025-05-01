const mockGetUser = jest.fn();
const mockEq = jest.fn();
const mockSingle = jest.fn();
const mockSelect = jest.fn(() => ({
  eq: mockEq,
  single: mockSingle,
}));

export { mockGetUser, mockEq, mockSingle, mockSelect };

export const createClient = jest.fn().mockImplementation(() => ({
  auth: {
    getUser: mockGetUser,
  },
  from: jest.fn(() => ({
    select: mockSelect,
  })),
}));
