import React from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Link } from 'react-router-dom'

// --Manage-le-drag-drop----------------------->>
interface DragDropProps extends React.HTMLAttributes<HTMLDivElement> {
	itemId: number
	content: any
	moveItem: (draggedId: number, droppedId: number) => void
}
interface Item {
	id: number
}

export function DragDrop({ itemId, content, moveItem, ...divParams }: DragDropProps) {
	// Valeurs
	const [, drag] = useDrag<Item>({
		type: 'item',
		item: { id: itemId }
	})
	const [, drop] = useDrop<Item>({
		accept: 'item',
		drop: (item) => moveItem(item.id, itemId)
	})

	// Modifieurs

	// Retour
	return (
		<div ref={(node) => drag(drop(node))} {...divParams}>
			{content}
		</div >
	)
}

// --Genere-un-bouton-------------------------->>
interface newBoxProps {
	tag: string
	className?: string
	to?: string
	onMouseDown?: (() => void)
	onMouseUp?: (() => void)
	onMouseEnter?: (() => void)
	onMouseLeave?: (() => void)
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
	const render = function () {
		const linksMap: { [key: string]: () => JSX.Element | null } = {
			'div': isDiv,
			'Link': isLink
		}
		return linksMap[tag] ? linksMap[tag]() : linksMap['div']()
	}

	// Retour
	return <>{render()}</>
}