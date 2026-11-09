const assert = require('node:assert/strict');
const test = require('node:test');
const CachePolicy = require('http-cache-semantics');

const originalRequest = {
  method: 'GET',
  url: 'https://example.test/account',
  headers: { host: 'example.test' },
};
const staleRequest = {
  ...originalRequest,
  headers: { ...originalRequest.headers, 'cache-control': 'max-stale=3600' },
};

function policy(headers, options) {
  return new CachePolicy(originalRequest, { status: 200, headers }, options);
}

test('shared Set-Cookie response cannot be reused with max-stale', () => {
  const cached = policy({ 'set-cookie': 'session=other-user' });
  assert.equal(cached.storable(), true);
  assert.equal(cached.maxAge(), 0);
  assert.equal(cached.satisfiesWithoutRevalidation(staleRequest), false);
  assert.equal(
    CachePolicy.fromObject(cached.toObject()).satisfiesWithoutRevalidation(staleRequest),
    false,
  );
  assert.equal(
    cached.satisfiesWithoutRevalidation({
      ...staleRequest,
      headers: { ...originalRequest.headers, 'cache-control': 'max-stale' },
    }),
    false,
  );
});

test('shared proxy-revalidate and no-cache responses require revalidation', () => {
  for (const directive of ['proxy-revalidate', 'no-cache']) {
    const cached = policy({ 'cache-control': directive });
    assert.equal(cached.satisfiesWithoutRevalidation(staleRequest), false);
    assert.equal(cached.evaluateRequest(staleRequest).response, undefined);
  }
});

test('protected responses cannot be served by other stale paths', () => {
  for (const directive of ['stale-if-error=3600', 'stale-while-revalidate=3600']) {
    const cached = policy({
      'set-cookie': 'session=other-user',
      'cache-control': directive,
    });
    assert.equal(cached.timeToLive(), 0);
    assert.equal(cached.evaluateRequest(staleRequest).response, undefined);
    assert.equal(cached.useStaleWhileRevalidate(), false);
    assert.throws(() => cached.revalidatedPolicy(staleRequest, undefined), /Response headers missing/);
  }
});

test('ordinary stale responses still honor max-stale', () => {
  const cached = policy({ 'cache-control': 'max-age=0' });
  assert.equal(cached.satisfiesWithoutRevalidation(staleRequest), true);
});

test('explicitly public and private-cache cookie responses retain their behavior', () => {
  const publicResponse = policy({
    'set-cookie': 'session=public',
    'cache-control': 'public, max-age=0',
  });
  const privateCache = policy({ 'set-cookie': 'session=owner' }, { shared: false });
  assert.equal(publicResponse.satisfiesWithoutRevalidation(staleRequest), true);
  assert.equal(privateCache.satisfiesWithoutRevalidation(staleRequest), true);
});
