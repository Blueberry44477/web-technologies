import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    server: { 
        port: 5173,
        strictPort: true,
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                friends: resolve(__dirname, 'app.html'),
            },
        },
    },
});