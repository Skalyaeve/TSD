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
	tag: string
	className?: string | undefined
	to?: string | undefined
	onMouseDown?: (() => void) | undefined
	onMouseUp?: (() => void) | undefined
	onMouseEnter?: (() => void) | undefined
	onMouseLeave?: (() => void) | undefined
	content?: any
}

export function newBox({
	tag,
	className,
	to,
	onMouseEnter,
	onMouseLeave,
	onMouseDown,
	onMouseUp,
	content
}: newBoxProps) {
	// Valeurs
	const isDiv = () => (
		<div className={className}
			onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
			onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
			{content}
		</div>
	)
	const isLink = () => {
		if (to != undefined) {
			return (
				<Link className={className} to={to}
					onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
					onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
					{content}
				</Link>
			);
		}
		return null;
	}

	// Modifieurs
	const render = () => {
		const linksMap: { [key: string]: () => JSX.Element | null } = {
			'div': isDiv,
			'Link': isLink
		}
		return linksMap[tag] ? linksMap[tag]() : linksMap['div']()
	}

	// Retour
	return <>{render()}</>
}