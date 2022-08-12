import expressApp from './app';

// start express app
expressApp.startServerSync();

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) =>
  process.on(signal, () => {
    console.log('Process End');
    process.exit();
  })
);
