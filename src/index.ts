#!/usr/bin/env node

import { DidoCLI } from './cli';

const cli = new DidoCLI();
cli.run().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
