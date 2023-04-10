import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from './components/Main.tsx';
import './css/index.css';

const root = document.getElementById('main');

if (root) {
	createRoot(root).render(<Main />);
} else {
	console.error("createRoot(root).render(<Main />) failed");
}