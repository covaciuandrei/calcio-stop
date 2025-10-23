/**
 * @jest-environment jsdom
 */

import { useTeamsStore } from '../stores/teamsStore';
import { Team } from '../types';

// Mock crypto
global.crypto = {
  randomUUID: () => 'mock-uuid-123',
};

// Mock Supabase
const mockSupabase = {
  from: jest.fn(() => ({
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    })),
    select: jest.fn(() => ({
      is: jest.fn(() => ({
        not: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      }))
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      }))
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(() => Promise.resolve({ error: null }))
    }))
  }))
};

// Mock the db module
jest.mock('../lib/db', () => ({
  createTeam: jest.fn(),
  getTeams: jest.fn(),
  getArchivedTeams: jest.fn(),
  updateTeam: jest.fn(),
  deleteTeam: jest.fn(),
  archiveTeam: jest.fn(),
  restoreTeam: jest.fn(),
}));

import * as db from '../lib/db';

describe('Teams Store CRUD Operations (Supabase)', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset store state
    useTeamsStore.setState({
      teams: [],
      archivedTeams: [],
      isLoading: false,
      error: null,
    });
  });

  describe('CREATE Operations', () => {
    test('should add a new team to the store', async () => {
      const newTeam: Team = {
        id: 'mock-uuid-123',
        name: 'Real Madrid',
        createdAt: expect.any(String),
      };

      // Mock the database call
      db.createTeam.mockResolvedValue(newTeam);

      const { addTeam } = useTeamsStore.getState();
      await addTeam({ name: 'Real Madrid' });

      const state = useTeamsStore.getState();
      expect(state.teams).toHaveLength(1);
      expect(state.teams[0].name).toBe('Real Madrid');
      expect(db.createTeam).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Real Madrid',
          id: expect.any(String),
          createdAt: expect.any(String),
        })
      );
    });

    test('should handle errors when adding a team', async () => {
      const errorMessage = 'Database connection failed';
      db.createTeam.mockRejectedValue(new Error(errorMessage));

      const { addTeam } = useTeamsStore.getState();
      await addTeam({ name: 'Real Madrid' });

      const state = useTeamsStore.getState();
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
      expect(state.teams).toHaveLength(0);
    });
  });

  describe('READ Operations', () => {
    test('should load teams from database', async () => {
      const teams: Team[] = [
        {
          id: 'team-1',
          name: 'Real Madrid',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'team-2',
          name: 'Barcelona',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      db.getTeams.mockResolvedValue(teams);

      const { loadTeams } = useTeamsStore.getState();
      await loadTeams();

      const state = useTeamsStore.getState();
      expect(state.teams).toEqual(teams);
      expect(state.isLoading).toBe(false);
      expect(db.getTeams).toHaveBeenCalled();
    });

    test('should load archived teams from database', async () => {
      const archivedTeams: Team[] = [
        {
          id: 'team-3',
          name: 'Arsenal',
          createdAt: '2024-01-03T00:00:00.000Z',
        },
      ];

      db.getArchivedTeams.mockResolvedValue(archivedTeams);

      const { loadArchivedTeams } = useTeamsStore.getState();
      await loadArchivedTeams();

      const state = useTeamsStore.getState();
      expect(state.archivedTeams).toEqual(archivedTeams);
      expect(state.isLoading).toBe(false);
      expect(db.getArchivedTeams).toHaveBeenCalled();
    });
  });

  describe('UPDATE Operations', () => {
    test('should update an existing team', async () => {
      const existingTeam: Team = {
        id: 'team-1',
        name: 'Real Madrid',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const updatedTeam: Team = {
        ...existingTeam,
        name: 'Real Madrid CF',
      };

      // Set initial state
      useTeamsStore.setState({ teams: [existingTeam] });

      db.updateTeam.mockResolvedValue(updatedTeam);

      const { updateTeam } = useTeamsStore.getState();
      await updateTeam('team-1', { name: 'Real Madrid CF' });

      const state = useTeamsStore.getState();
      expect(state.teams[0]).toEqual(updatedTeam);
      expect(db.updateTeam).toHaveBeenCalledWith('team-1', { name: 'Real Madrid CF' });
    });

    test('should handle errors when updating a team', async () => {
      const existingTeam: Team = {
        id: 'team-1',
        name: 'Real Madrid',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useTeamsStore.setState({ teams: [existingTeam] });

      const errorMessage = 'Update failed';
      db.updateTeam.mockRejectedValue(new Error(errorMessage));

      const { updateTeam } = useTeamsStore.getState();
      await updateTeam('team-1', { name: 'Real Madrid CF' });

      const state = useTeamsStore.getState();
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('DELETE Operations', () => {
    test('should delete a team from the store', async () => {
      const teams: Team[] = [
        {
          id: 'team-1',
          name: 'Real Madrid',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'team-2',
          name: 'Barcelona',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      useTeamsStore.setState({ teams });

      db.deleteTeam.mockResolvedValue();

      const { deleteTeam } = useTeamsStore.getState();
      await deleteTeam('team-1');

      const state = useTeamsStore.getState();
      expect(state.teams).toHaveLength(1);
      expect(state.teams[0].id).toBe('team-2');
      expect(db.deleteTeam).toHaveBeenCalledWith('team-1');
    });

    test('should handle errors when deleting a team', async () => {
      const teams: Team[] = [
        {
          id: 'team-1',
          name: 'Real Madrid',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      useTeamsStore.setState({ teams });

      const errorMessage = 'Delete failed';
      db.deleteTeam.mockRejectedValue(new Error(errorMessage));

      const { deleteTeam } = useTeamsStore.getState();
      await deleteTeam('team-1');

      const state = useTeamsStore.getState();
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
      expect(state.teams).toHaveLength(1); // Team should still be there
    });
  });

  describe('ARCHIVE Operations', () => {
    test('should archive a team', async () => {
      const teams: Team[] = [
        {
          id: 'team-1',
          name: 'Real Madrid',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      const archivedTeam = { ...teams[0] };

      useTeamsStore.setState({ teams, archivedTeams: [] });

      db.archiveTeam.mockResolvedValue(archivedTeam);

      const { archiveTeam } = useTeamsStore.getState();
      await archiveTeam('team-1');

      const state = useTeamsStore.getState();
      expect(state.teams).toHaveLength(0);
      expect(state.archivedTeams).toHaveLength(1);
      expect(state.archivedTeams[0]).toEqual(archivedTeam);
      expect(db.archiveTeam).toHaveBeenCalledWith('team-1');
    });

    test('should restore an archived team', async () => {
      const archivedTeams: Team[] = [
        {
          id: 'team-1',
          name: 'Real Madrid',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      const restoredTeam = { ...archivedTeams[0] };

      useTeamsStore.setState({ teams: [], archivedTeams });

      db.restoreTeam.mockResolvedValue(restoredTeam);

      const { restoreTeam } = useTeamsStore.getState();
      await restoreTeam('team-1');

      const state = useTeamsStore.getState();
      expect(state.teams).toHaveLength(1);
      expect(state.teams[0]).toEqual(restoredTeam);
      expect(state.archivedTeams).toHaveLength(0);
      expect(db.restoreTeam).toHaveBeenCalledWith('team-1');
    });
  });

  describe('SET Operations', () => {
    test('should set teams directly', () => {
      const teams: Team[] = [
        {
          id: 'team-1',
          name: 'Real Madrid',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      const { setTeams } = useTeamsStore.getState();
      setTeams(teams);

      const state = useTeamsStore.getState();
      expect(state.teams).toEqual(teams);
    });

    test('should set archived teams directly', () => {
      const archivedTeams: Team[] = [
        {
          id: 'team-1',
          name: 'Real Madrid',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      const { setArchivedTeams } = useTeamsStore.getState();
      setArchivedTeams(archivedTeams);

      const state = useTeamsStore.getState();
      expect(state.archivedTeams).toEqual(archivedTeams);
    });
  });

  describe('Loading States', () => {
    test('should set loading state during operations', async () => {
      const newTeam = {
        id: 'mock-uuid-123',
        name: 'Real Madrid',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      // Mock a slow operation
      db.createTeam.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(newTeam), 100))
      );

      const { addTeam } = useTeamsStore.getState();
      const promise = addTeam({ name: 'Real Madrid' });

      // Check loading state immediately after starting
      let state = useTeamsStore.getState();
      expect(state.isLoading).toBe(true);

      await promise;

      // Check loading state after completion
      state = useTeamsStore.getState();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('should clear error when starting new operation', async () => {
      // Set an error state
      useTeamsStore.setState({ error: 'Previous error' });

      db.createTeam.mockResolvedValue({});

      const { addTeam } = useTeamsStore.getState();
      await addTeam({ name: 'Real Madrid' });

      const state = useTeamsStore.getState();
      expect(state.error).toBe(null);
    });
  });
});
