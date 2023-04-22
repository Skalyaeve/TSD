import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { createRoot } from 'react-dom/client'
import Root from './components/Root.tsx'
import './css/Root.css'

const root = document.getElementById('root')
const strictMode = true

if (root) {
	if (strictMode) createRoot(root).render(
		<React.StrictMode>
			<DndProvider backend={HTML5Backend}>
				<BrowserRouter>
					<Root />
				</BrowserRouter>
			</DndProvider>
		</React.StrictMode>
	)
	else createRoot(root).render(
		<DndProvider backend={HTML5Backend}>
			<BrowserRouter>
				<Root />
			</BrowserRouter>
		</DndProvider>
	)
} else console.error('[ERROR] document.getElementById(\'root\') failed')