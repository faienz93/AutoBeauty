/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PouchDbService } from '../src/services/database/pouchDbService';

declare global {
  var __pouchdb_mock_behaviors: any;
}

vi.mock('pouchdb', () => {
  const instances: any[] = [];
  let counter = 0;

  const MockPouchDB: any = function (dbName: string) {
    const id = counter++;
    const name = dbName;
    const behavior = globalThis.__pouchdb_mock_behaviors?.[id] || {};
    const instance: any = {
      _mockId: id,
      name,
      info: vi.fn(async () => {
        if (behavior.info?.throw)
          throw new Error(behavior.info.message || 'info error');
        return {
          db_name: name,
          doc_count: 0,
          update_seq: 0
        };
      }),
      put: vi.fn(async (doc: any) => {
        if (behavior.put?.throw)
          throw new Error(behavior.put.message || 'put error');
        return { ok: true, id: doc._id || 'generated-id', rev: '1-abc' };
      }),
      get: vi.fn(async (id: string) => {
        if (behavior.get?.throw)
          throw new Error(behavior.get.message || 'get error');
        return { _id: id, value: 'some' };
      }),
      allDocs: vi.fn(async (options?: any) => {
        if (behavior.allDocs?.throw)
          throw new Error(behavior.allDocs.message || 'allDocs error');
        return { rows: [] };
      }),
      bulkDocs: vi.fn(async (docs: any[], options?: any) => {
        if (behavior.bulkDocs?.throw)
          throw new Error(behavior.bulkDocs.message || 'bulkDocs error');
        return docs.map((d, i) => ({
          ok: true,
          id: d._id || `id-${i}`,
          rev: '1-abc'
        }));
      }),
      remove: vi.fn(async (doc: any) => {
        if (behavior.remove?.throw)
          throw new Error(behavior.remove.message || 'remove error');
        return { ok: true, id: doc._id || 'removed-id', rev: '2-abc' };
      }),
      close: vi.fn(async () => {
        if (behavior.close?.throw)
          throw new Error(behavior.close.message || 'close error');
        return;
      }),
      destroy: vi.fn(async () => {
        if (behavior.destroy?.throw)
          throw new Error(behavior.destroy.message || 'destroy error');
        return;
      })
    };

    // optionally omit find to simulate missing plugin
    if (!behavior.noFind) {
      instance.find = vi.fn(async (query: any) => {
        if (behavior.find?.throw)
          throw new Error(behavior.find.message || 'find error');
        return { docs: [] };
      });
    }

    instances[id] = instance;
    return instance;
  };

  MockPouchDB.plugin = vi.fn();

  // expose helpers for tests
  (MockPouchDB as any)._instances = instances;
  (MockPouchDB as any)._reset = () => {
    (MockPouchDB as any)._instances.length = 0;
    counter = 0;
    globalThis.__pouchdb_mock_behaviors = {};
  };

  return {
    default: MockPouchDB
  };
});

class TestPouchDbService extends PouchDbService {
  protected async createSpecificIndexes(): Promise<void> {
    // no-op for tests
    return;
  }
}

beforeEach(() => {
  // reset behaviors and mock instances between tests
  const pouch = vi.mocked(require('pouchdb')).default as any as any;
  if (pouch && pouch._reset) pouch._reset();
  globalThis.__pouchdb_mock_behaviors = {};
  vi.restoreAllMocks();
});

describe('PouchDbService', () => {
  it('should get info successfully', async () => {
    const svc = new TestPouchDbService('test-db');
    const info = await svc.getInfo();
    expect(info.db_name).toBe('test-db');
    expect(info.doc_count).toBeDefined();
  });

  it('should throw and log on getInfo error', async () => {
    // arrange behavior to throw on info for instance 0
    globalThis.__pouchdb_mock_behaviors = {
      0: { info: { throw: true, message: 'fail-info' } }
    };
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const svc = new TestPouchDbService('err-db');
    await expect(svc.getInfo()).rejects.toThrow(/fail-info/);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should put and get documents', async () => {
    const svc = new TestPouchDbService('put-get-db');
    const putRes = await svc.put({ _id: 'doc1', foo: 'bar' } as any);
    expect(putRes.ok).toBe(true);
    const got = await svc.get<{ _id: string; value: string }>('doc1');
    expect(got._id).toBe('doc1');
  });

  it('should allDocs and handle error', async () => {
    const svc = new TestPouchDbService('alldoc-db');
    const res = await svc.allDocs();
    expect(res.rows).toBeDefined();
    // now simulate error
    globalThis.__pouchdb_mock_behaviors = {
      1: { allDocs: { throw: true, message: 'allDocs fail' } }
    };
    const svc2 = new TestPouchDbService('alldoc-db-2');
    await expect(svc2.allDocs()).rejects.toThrow(/allDocs fail/);
  });

  it('should bulkDocs and handle error', async () => {
    const svc = new TestPouchDbService('bulk-db');
    const results = await svc.bulkDocs([{ _id: 'a' }] as any);
    expect(Array.isArray(results)).toBe(true);
    globalThis.__pouchdb_mock_behaviors = {
      2: { bulkDocs: { throw: true, message: 'bulk fail' } }
    };
    const svc2 = new TestPouchDbService('bulk-db-2');
    await expect(svc2.bulkDocs([{ _id: 'b' }] as any)).rejects.toThrow(
      /bulk fail/
    );
  });

  it('should remove and handle error', async () => {
    const svc = new TestPouchDbService('remove-db');
    const res = await svc.remove({ _id: 'to-remove' } as any);
    expect(res.ok).toBe(true);
    globalThis.__pouchdb_mock_behaviors = {
      3: { remove: { throw: true, message: 'remove fail' } }
    };
    const svc2 = new TestPouchDbService('remove-db-2');
    await expect(svc2.remove({ _id: 'x' } as any)).rejects.toThrow(
      /remove fail/
    );
  });

  it('should close database and handle error', async () => {
    const svc = new TestPouchDbService('close-db');
    await expect(svc.closeDatabase()).resolves.toBeUndefined();
    globalThis.__pouchdb_mock_behaviors = {
      4: { close: { throw: true, message: 'close fail' } }
    };
    const svc2 = new TestPouchDbService('close-db-2');
    await expect(svc2.closeDatabase()).rejects.toThrow(/close fail/);
  });

  it('should delete database and reinitialize', async () => {
    const pouch = vi.mocked(require('pouchdb')).default as any as any;
    const svc = new TestPouchDbService('del-db');
    const firstId = (svc as any).db._mockId;
    await svc.deleteDatabase();
    const secondId = (svc as any).db._mockId;
    expect(secondId).not.toBe(firstId);
  });

  it('should throw on deleteDatabase error', async () => {
    globalThis.__pouchdb_mock_behaviors = {
      6: { destroy: { throw: true, message: 'destroy fail' } }
    };
    const svc = new TestPouchDbService('del-db-err');
    await expect(svc.deleteDatabase()).rejects.toThrow(/destroy fail/);
  });

  it('should run find when available and handle missing find', async () => {
    const svc = new TestPouchDbService('find-db');
    const res = await svc.find({ selector: {} } as any);
    expect(res.docs).toBeDefined();

    // simulate missing find on next instance
    globalThis.__pouchdb_mock_behaviors = { 8: { noFind: true } };
    const svc2 = new TestPouchDbService('find-db-no-plugin');
    await expect(svc2.find({ selector: {} } as any)).rejects.toThrow(
      /PouchDB find plugin not initialized/
    );
  });

  it('should log and rethrow errors from find', async () => {
    globalThis.__pouchdb_mock_behaviors = {
      9: { find: { throw: true, message: 'find fail' } }
    };
    const svc = new TestPouchDbService('find-db-err');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(svc.find({ selector: {} } as any)).rejects.toThrow(
      /find fail/
    );
    expect(consoleSpy).toHaveBeenCalled();
  });
});
