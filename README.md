###
```npm i```

To run
```
npm run build-and-preview
```

npm run dev does not activate the service worker, unless you 
enable 
```
      // devOptions: { enabled: true }, // - to run service worker in dev
```

in vite.config.ts