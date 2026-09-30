/**
 * Products Service Tests
 * 
 * This file contains unit tests for the ProductsService, which handles product-related operations
 * such as retrieving all products and finding individual products with their relations.
 * The tests use mocked dependencies to isolate the service behavior without external database calls.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { SellersService } from '../sellers/sellers.service';
import { SubcategoriesService } from '../subcategories/subcategories.service';

/**
 * Test suite for ProductsService
 */
describe('ProductsService', () => {
  /**
   * Reference to the service instance being tested
   */
  let service: ProductsService;

  /**
   * Mock implementation of ProductRepository to isolate service tests
   * Mocks all repository methods (create, save, find, findOne, delete)
   * Allows controlling method behavior and verifying call parameters during testing
   */
  const productsRepositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  /**
   * Mock implementation of SellersService to isolate service tests
   * Mocks the findOne method used by ProductsService to fetch seller information
   */
  const sellersServiceMock = {
    findOne: jest.fn(),
  };

  /**
   * Mock implementation of SubcategoriesService to isolate service tests
   * Mocks the findOne method used by ProductsService to fetch subcategory information
   */
  const subcategoriesServiceMock = {
    findOne: jest.fn(),
  };


  /**
   * Setup before each test case
   * Creates a testing module with mocked dependencies for isolation
   * Provides mock implementations for ProductRepository, SellersService, and SubcategoriesService
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken( Product ),
          useValue: productsRepositoryMock,
        },
        {
          provide: SellersService,
          useValue: sellersServiceMock,
        },
        {
          provide: SubcategoriesService,
          useValue: subcategoriesServiceMock,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  /**
   * Test case for retrieving all products
   * Verifies that findAll() returns products with seller and subcategory relations
   * Ensures proper repository method call with correct relations parameter
   */
  it( "returns all products with their relations", async () =>
  {
    const products = [
      {
        id: "product-1",
        name: "Laptop",
      },
    ] as Product[];

    productsRepositoryMock.find.mockResolvedValue( products );

    await expect( service.findAll() ).resolves.toEqual( products );

    expect( productsRepositoryMock.find ).toHaveBeenCalledWith( {
      relations: ["seller", "subcategory"],
    } );
  } );

  /**
   * Test case for finding a specific product
   * Verifies that findOne() throws an error when product doesn't exist
   * Ensures proper repository method call with correct where clause and relations
   */
  it( "throws when the product does not exist", async () =>
  {
    productsRepositoryMock.findOne.mockResolvedValue( null );

    await expect( service.findOne( "missing-id" ) ).rejects.toThrow(
      "Product not found",
    );

    expect( productsRepositoryMock.findOne ).toHaveBeenCalledWith( {
      where: { id: "missing-id" },
      relations: ["seller", "subcategory"],
    } );
  } );
});