import cluster from 'cluster';
import os from 'os';

const numCpu = os.cpus().length;

if (cluster.isPrimary) {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < numCpu; i++) {
    cluster.fork();
  }

  // listen to dying worker and fork on another worker
  cluster.on('exist', () => {
    cluster.fork();
  });
}

if (!cluster.isPrimary) {
  // eslint-disable-next-line global-require
  require('./server');
}
