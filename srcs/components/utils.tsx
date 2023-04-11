import React from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Link } from 'react-router-dom'

// --Manage-le-drag-drop----------------------->>
interface DragDropProps {
	id: number
	text: string
	moveItem: (draggedId: number, droppedId: number) => void
}
interface Item {
	id: number
}

export function DragDrop({ id, text, moveItem }: DragDropProps) {
	// Valeurs
	const [, drag] = useDrag<Item, void, unknown>({
		type: 'CHAT_ROOM_ITEM',
		item: { id }
	})
	const [, drop] = useDrop<Item, void, unknown>({
		accept: 'CHAT_ROOM_ITEM',
		drop: (item) => moveItem(item.id, id)
	})

	// Modifieurs

	// Retour
	return (
		<div ref={(node) => drag(drop(node))}>
			{text}
		</div>
	)
}

// --Genere-un-bouton-------------------------->>
interface newBoxProps {
	className: string | undefined
	to: string | undefined
	onMouseDown: (() => void) | undefined
	onMouseUp: (() => void) | undefined
	content: any
}

export function newBox({ className, onMouseDown, onMouseUp, to, content }: newBoxProps) {
	// Valeurs

	// Modifieurs

	// Retour
	return (
		<>
			{to === undefined ? (
				<div className={className} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
					{content}
				</div>
			) : (
				<Link className={className} to={to} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
					{content}
				</Link>
			)}
		</>
	)
}