import React from 'react';
import { createRoot } from 'react-dom/client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Main from './components/Main.tsx';
import './css/index.css';

const root = document.getElementById('main');
const strictMode = true

if (root) {
	if (strictMode)
		createRoot(root).render(
			<DndProvider backend={HTML5Backend}>
				<React.StrictMode>
					<Main />
				</React.StrictMode>
			</DndProvider>
		)
	else
		createRoot(root).render(
			<DndProvider backend={HTML5Backend}>
				<Main />
			</DndProvider>
		)
} else {
	console.error("createRoot(root).render(<Main />) failed");
}