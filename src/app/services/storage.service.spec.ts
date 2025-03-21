import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    // Réinitialiser le localStorage avant chaque test
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [StorageService],
    });

    service = TestBed.inject(StorageService);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  describe('store', () => {
    it('devrait stocker correctement des données dans localStorage', () => {
      // Données de test
      const testKey = 'testKey';
      const testData = { id: 1, name: 'Test' };

      // Appel de la méthode à tester
      service.store(testKey, testData);

      // Vérification que les données sont correctement stockées
      expect(localStorage.getItem(testKey)).toBe(JSON.stringify(testData));
    });
  });

  describe('get', () => {
    it('devrait récupérer correctement des données de localStorage', () => {
      // Données de test
      const testKey = 'testKey';
      const testData = { id: 1, name: 'Test' };

      // Pré-remplissage du localStorage
      localStorage.setItem(testKey, JSON.stringify(testData));

      // Appel de la méthode à tester
      const result = service.get(testKey);

      // Vérifications
      expect(result).toEqual(testData);
    });

    it("devrait retourner null si la clé n'existe pas", () => {
      // Appel de la méthode avec une clé inexistante
      const result = service.get('keyInexistante');

      // Vérification
      expect(result).toBeNull();
    });
  });
});
