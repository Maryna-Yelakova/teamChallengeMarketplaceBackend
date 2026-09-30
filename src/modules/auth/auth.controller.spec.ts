/**
 * Authentication Controller Tests
 * 
 * This file contains unit tests for the AuthController, which handles authentication-related endpoints
 * such as login, registration, logout, and token refresh functionalities.
 * Tests mock the AuthService to isolate controller behavior without external dependencies.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import type { Response } from 'express';

/**
 * Test suite for AuthController
 */
describe('AuthController', () => {
  /**
   * Reference to the controller instance being tested
   */
  let controller: AuthController;

  /**
   * Mock implementation of AuthService to isolate controller tests
   * All methods are mocked using jest.fn() to control their behavior and verify calls
   */
  const authServiceMock = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    refresh: jest.fn(),
  };

  /**
   * Setup before each test case
   * Clears all mock calls and creates a testing module with mocked AuthService
   */
  beforeEach( async () =>
  {
    jest.clearAllMocks(); // Clear previous mock calls to ensure test isolation

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock, // Use the mocked service instead of the real one
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  /**
   * Test case for logout functionality
   * Verifies that the controller delegates logout calls to the AuthService and returns expected results
   */
  it( 'delegates logout to AuthService', () =>
  {
    const response = {} as Response; // Mock response object
    const result = { message: 'Logged out successfully' }; // Expected return value

    authServiceMock.logout.mockReturnValue( result ); // Configure mock to return specific result

    expect( controller.logout( response ) ).toEqual( result ); // Verify controller returns expected result
    expect( authServiceMock.logout ).toHaveBeenCalledWith( response ); // Verify mock was called with correct args
  } );
});