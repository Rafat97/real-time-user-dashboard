import expressApp from './app';

// start express app
expressApp.startServerSync();


['SIGINT', 'SIGTERM', 'SIGQUIT', "EADDRINUSE"].forEach((signal) =>
  process.on(signal, () => {
    console.log('Process End');
    process.exit();
  })
);
