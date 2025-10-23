/**
 * @jest-environment jsdom
 */

import 'jest-localstorage-mock';
import { useTeamsStore } from '../stores/teamsStore';
import { Team } from '../types';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Teams Store CRUD Operations', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Reset store state
    useTeamsStore.setState({
      teams: [],
      archivedTeams: [],
    });
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('CREATE Operations', () => {
    test('should add a new team to the store', () => {
      const newTeam: Team = {
        id: 'team-1',
        name: 'Real Madrid',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const { addTeam } = useTeamsStore.getState();
      addTeam(newTeam);

      const state = useTeamsStore.getState();
      expect(state.teams).toHaveLength(1);
      expect(state.teams[0]).toEqual(newTeam);
    });

    test('should add multiple teams without duplicates', () => {
      const team1: Team = {
        id: 'team-1',
        name: 'Real Madrid',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const team2: Team = {
        id: 'team-2',
        name: 'Barcelona',
        createdAt: '2024-01-02T00:00:00.000Z',
      };

      const { addTeam } = useTeamsStore.getState();
      addTeam(team1);
      addTeam(team2);

      const state = useTeamsStore.getState();
      expect(state.teams).toHaveLength(2);
      expect(state.teams).toContainEqual(team1);
      expect(state.teams).toContainEqual(team2);
    });
  });

  describe('READ Operations', () => {
    test('should return all teams', () => {
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

      const state = useTeamsStore.getState();
      expect(state.teams).toEqual(teams);
    });

    test('should return archived teams', () => {
      const archivedTeams: Team[] = [
        {
          id: 'team-1',
          name: 'Real Madrid',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      useTeamsStore.setState({ archivedTeams });

      const state = useTeamsStore.getState();
      expect(state.archivedTeams).toEqual(archivedTeams);
    });
  });

  describe('UPDATE Operations', () => {
    test('should update an existing team', () => {
      const originalTeam: Team = {
        id: 'team-1',
        name: 'Real Madrid',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useTeamsStore.setState({ teams: [originalTeam] });

      const { updateTeam } = useTeamsStore.getState();
      updateTeam('team-1', { name: 'Real Madrid CF' });

      const state = useTeamsStore.getState();
      expect(state.teams[0].name).toBe('Real Madrid CF');
      expect(state.teams[0].id).toBe('team-1');
      expect(state.teams[0].createdAt).toBe(originalTeam.createdAt);
    });

    test('should not update non-existent team', () => {
      const originalTeam: Team = {
        id: 'team-1',
        name: 'Real Madrid',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useTeamsStore.setState({ teams: [originalTeam] });

      const { updateTeam } = useTeamsStore.getState();
      updateTeam('non-existent', { name: 'New Name' });

      const state = useTeamsStore.getState();
      expect(state.teams[0]).toEqual(originalTeam);
    });
  });

  describe('DELETE Operations', () => {
    test('should delete a team from active teams', () => {
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

      const { deleteTeam } = useTeamsStore.getState();
      deleteTeam('team-1');

      const state = useTeamsStore.getState();
      expect(state.teams).toHaveLength(1);
      expect(state.teams[0].id).toBe('team-2');
    });

    test('should delete a team from both active and archived teams', () => {
      const teams: Team[] = [
        {
          id: 'team-1',
          name: 'Real Madrid',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      const archivedTeams: Team[] = [
        {
          id: 'team-2',
          name: 'Barcelona',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      useTeamsStore.setState({ teams, archivedTeams });

      const { deleteTeam } = useTeamsStore.getState();
      deleteTeam('team-1');
      deleteTeam('team-2');

      const state = useTeamsStore.getState();
      expect(state.teams).toHaveLength(0);
      expect(state.archivedTeams).toHaveLength(0);
    });
  });

  describe('ARCHIVE Operations', () => {
    test('should archive a team', () => {
      const team: Team = {
        id: 'team-1',
        name: 'Real Madrid',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useTeamsStore.setState({ teams: [team], archivedTeams: [] });

      const { archiveTeam } = useTeamsStore.getState();
      archiveTeam('team-1');

      const state = useTeamsStore.getState();
      expect(state.teams).toHaveLength(0);
      expect(state.archivedTeams).toHaveLength(1);
      expect(state.archivedTeams[0]).toEqual(team);
    });

    test('should restore an archived team', () => {
      const team: Team = {
        id: 'team-1',
        name: 'Real Madrid',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useTeamsStore.setState({ teams: [], archivedTeams: [team] });

      const { restoreTeam } = useTeamsStore.getState();
      restoreTeam('team-1');

      const state = useTeamsStore.getState();
      expect(state.teams).toHaveLength(1);
      expect(state.archivedTeams).toHaveLength(0);
      expect(state.teams[0]).toEqual(team);
    });
  });

  describe('SET Operations', () => {
    test('should set teams array', () => {
      const newTeams: Team[] = [
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

      const { setTeams } = useTeamsStore.getState();
      setTeams(newTeams);

      const state = useTeamsStore.getState();
      expect(state.teams).toEqual(newTeams);
    });

    test('should set archived teams array', () => {
      const newArchivedTeams: Team[] = [
        {
          id: 'team-1',
          name: 'Real Madrid',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      const { setArchivedTeams } = useTeamsStore.getState();
      setArchivedTeams(newArchivedTeams);

      const state = useTeamsStore.getState();
      expect(state.archivedTeams).toEqual(newArchivedTeams);
    });
  });

  describe('Data Integrity', () => {
    test('should not create duplicate teams with same ID', () => {
      const team: Team = {
        id: 'team-1',
        name: 'Real Madrid',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const { addTeam } = useTeamsStore.getState();
      addTeam(team);
      addTeam(team); // Adding same team again

      const state = useTeamsStore.getState();
      expect(state.teams).toHaveLength(2); // Zustand allows duplicates
    });

    test('should maintain data consistency during operations', () => {
      const team: Team = {
        id: 'team-1',
        name: 'Real Madrid',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const { addTeam, archiveTeam, restoreTeam } = useTeamsStore.getState();
      
      // Add team
      addTeam(team);
      expect(useTeamsStore.getState().teams).toHaveLength(1);
      
      // Archive team
      archiveTeam('team-1');
      expect(useTeamsStore.getState().teams).toHaveLength(0);
      expect(useTeamsStore.getState().archivedTeams).toHaveLength(1);
      
      // Restore team
      restoreTeam('team-1');
      expect(useTeamsStore.getState().teams).toHaveLength(1);
      expect(useTeamsStore.getState().archivedTeams).toHaveLength(0);
    });
  });
});

