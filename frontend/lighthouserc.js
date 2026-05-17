// Lighthouse CI configuration.
//
// Usage (run on a non-laptop / CI environment):
//   npm run build
//   npx lhci autorun
//
// Targets a small representative sample of public tool pages. Backend-dependent
// flows are intentionally avoided here because Lighthouse runs against the
// frontend production server only.

module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/compress',
        'http://localhost:3000/merge',
        'http://localhost:3000/protect',
        'http://localhost:3000/pdf-to-word',
      ],
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'Ready',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
};
