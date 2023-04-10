import React from 'react';
import { createRoot } from 'react-dom/client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Main from './components/Main.tsx';
import './css/index.css';

const root = document.getElementById('main');

if (root) {
	createRoot(root).render(
		<DndProvider backend={HTML5Backend}>
			<Main />
		</DndProvider>
	);
} else {
	console.error("createRoot(root).render(<Main />) failed");
}