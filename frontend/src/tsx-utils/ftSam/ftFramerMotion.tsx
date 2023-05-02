// ------------------------------------------------------------------------ //
// --------ELEMENTS-------------------------------------------------------- //
// ------------------------------------------------------------------------ //

// --------FADE------------------------------------------------------------ //
export const fadeInOut = (
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { opacity: initialOpacity },
	animate: {
		opacity: maxOpacity,
		transition: { opacity: { duration: inDuration } }
	},
	exit: {
		opacity: initialOpacity,
		transition: { opacity: { duration: outDuration } }
	}
})

// ------------------------------------------------------------------------ //
// --------FORM------------------------------------------------------------ //
// ------------------------------------------------------------------------ //

// --------POP-UP---------------------------------------------------------- //
export const popUp = (
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { scale: 0, opacity: initialOpacity },
	animate: {
		scale: 1,
		opacity: maxOpacity,
		transition: {
			scale: { duration: inDuration },
			opacity: { duration: inDuration }
		}
	},
	exit: {
		scale: 0,
		opacity: initialOpacity,
		transition: {
			scale: { duration: outDuration },
			opacity: { duration: outDuration }
		}
	}
})

export const popUpByPercent = (
	width: number = 100,
	height: number = 100,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { width: 0, height: 0, opacity: initialOpacity },
	animate: {
		width: `${width}%`,
		height: `${height}%`,
		opacity: maxOpacity,
		transition: {
			width: { duration: inDuration },
			height: { duration: inDuration },
			opacity: { duration: inDuration }
		}
	},
	exit: {
		width: 0,
		height: 0,
		opacity: initialOpacity,
		transition: {
			width: { duration: outDuration },
			height: { duration: outDuration },
			opacity: { duration: outDuration }
		}
	}
})

export const popUpByPx = (
	width: number,
	height: number,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { width: 0, height: 0, opacity: initialOpacity },
	animate: {
		width: `${width}px`,
		height: `${height}px`,
		opacity: maxOpacity,
		transition: {
			width: { duration: inDuration },
			height: { duration: inDuration },
			opacity: { duration: inDuration }
		}
	},
	exit: {
		width: 0,
		height: 0,
		opacity: initialOpacity,
		transition: {
			width: { duration: outDuration },
			height: { duration: outDuration },
			opacity: { duration: outDuration }
		}
	}
})

// --------BOUNCY-POP-UP--------------------------------------------------- //
export const bouncyPopUp = (
	maxScale: number = 1.1,
	maxAt: number = 0.75,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { scale: 0, opacity: initialOpacity },
	animate: {
		scale: [0, maxScale, 1],
		opacity: maxOpacity,
		transition: {
			scale: { duration: inDuration, times: [0, maxAt, 1] },
			opacity: { duration: inDuration }
		}
	},
	exit: {
		scale: [1, maxScale, 0],
		opacity: initialOpacity,
		transition: {
			scale: { duration: outDuration, times: [0, 1 - maxAt, 1] },
			opacity: { duration: outDuration }
		}
	}
})

export const bouncyPopUpByPercent = (
	width: number = 100,
	height: number = 100,
	extraScale: number = 0.1,
	maxAt: number = 0.75,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { width: 0, height: 0, opacity: initialOpacity },
	animate: {
		width: ['0%', `${width + width * extraScale}%`, `${width}%`],
		height: ['0%', `${height + height * extraScale}%`, `${height}%`],
		opacity: maxOpacity,
		transition: {
			width: { duration: inDuration, times: [0, maxAt, 1] },
			height: { duration: inDuration, times: [0, maxAt, 1] },
			opacity: { duration: inDuration }
		}
	},
	exit: {
		width: [`${width}%`, `${width + width * extraScale}%`, '0%'],
		height: [`${height}%`, `${height + height * extraScale}%`, '0%'],
		opacity: initialOpacity,
		transition: {
			width: { duration: outDuration, times: [0, 1 - maxAt, 1] },
			height: { duration: outDuration, times: [0, 1 - maxAt, 1] },
			opacity: { duration: outDuration }
		}
	}
})

export const bouncyPopUpByPx = (
	width: number,
	height: number,
	extraScale: number = 0.1,
	maxAt: number = 0.75,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { width: 0, height: 0, opacity: initialOpacity },
	animate: {
		width: ['0px', `${width + width * extraScale}px`, `${width}px`],
		height: ['0px', `${height + height * extraScale}px`, `${height}px`],
		opacity: maxOpacity,
		transition: {
			width: { duration: inDuration, times: [0, maxAt, 1] },
			height: { duration: inDuration, times: [0, maxAt, 1] },
			opacity: { duration: inDuration }
		}
	},
	exit: {
		width: [`${width}px`, `${width + width * extraScale}px`, '0px'],
		height: [`${height}px`, `${height + height * extraScale}px`, '0px'],
		opacity: initialOpacity,
		transition: {
			width: { duration: outDuration, times: [0, 1 - maxAt, 1] },
			height: { duration: outDuration, times: [0, 1 - maxAt, 1] },
			opacity: { duration: outDuration }
		}
	}
})

// --------HEIGHT-GROW----------------------------------------------------- //
export const heightGrow = (
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { scaleY: 0, opacity: initialOpacity },
	animate: {
		scaleY: 1,
		opacity: maxOpacity,
		transition: {
			scaleY: { duration: inDuration },
			opacity: { duration: inDuration }
		}
	},
	exit: {
		scaleY: 0,
		opacity: initialOpacity,
		transition: {
			scaleY: { duration: outDuration },
			opacity: { duration: outDuration }
		}
	}
})

export const heightGrowByPercent = (
	height: number = 100,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { height: 0, opacity: initialOpacity },
	animate: {
		height: `${height}%`,
		opacity: maxOpacity,
		transition: {
			height: { duration: inDuration },
			opacity: { duration: inDuration }
		}
	},
	exit: {
		height: 0,
		opacity: initialOpacity,
		transition: {
			height: { duration: outDuration },
			opacity: { duration: outDuration }
		}
	}
})

export const heightGrowByPx = (
	height: number,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { height: 0, opacity: initialOpacity },
	animate: {
		height: `${height}px`,
		opacity: maxOpacity,
		transition: {
			height: { duration: inDuration },
			opacity: { duration: inDuration }
		}
	},
	exit: {
		height: 0,
		opacity: initialOpacity,
		transition: {
			height: { duration: outDuration },
			opacity: { duration: outDuration }
		}
	}
})

// --------BOUNCY-HEIGHT-GROW---------------------------------------------- //
export const bouncyHeightGrow = (
	maxScale: number = 1.1,
	maxAt: number = 0.75,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { scaleY: 0, opacity: initialOpacity },
	animate: {
		scaleY: [0, maxScale, 1],
		opacity: maxOpacity,
		transition: {
			scaleY: { duration: inDuration, times: [0, maxAt, 1] },
			opacity: { duration: inDuration }
		}
	},
	exit: {
		scaleY: [1, maxScale, 0],
		opacity: initialOpacity,
		transition: {
			scaleY: { duration: outDuration, times: [0, 1 - maxAt, 1] },
			opacity: { duration: outDuration }
		}
	}
})

export const bouncyHeightGrowByPercent = (
	height: number = 100,
	extraScale: number = 0.1,
	maxAt: number = 0.75,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1,
) => ({
	initial: { height: 0, opacity: initialOpacity },
	animate: {
		height: ['0%', `${height + height * extraScale}%`, `${height}%`],
		opacity: maxOpacity,
		transition: {
			height: { duration: inDuration, times: [0, maxAt, 1] },
			opacity: { duration: inDuration },
		}
	},
	exit: {
		height: [`${height}%`, `${height + height * extraScale}%`, '0%'],
		opacity: initialOpacity,
		transition: {
			height: { duration: outDuration, times: [0, 1 - maxAt, 1] },
			opacity: { duration: outDuration },
		}
	}
})

export const bouncyHeightGrowByPx = (
	height: number,
	extraScale: number = 0.1,
	maxAt: number = 0.75,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { height: 0, opacity: initialOpacity },
	animate: {
		height: ['0px', `${height + height * extraScale}px`, `${height}px`],
		opacity: maxOpacity,
		transition: {
			height: { duration: inDuration, times: [0, maxAt, 1] },
			opacity: { duration: inDuration }
		}
	},
	exit: {
		height: [`${height}px`, `${height + height * extraScale}px`, '0px'],
		opacity: initialOpacity,
		transition: {
			height: { duration: outDuration, times: [0, 1 - maxAt, 1] },
			opacity: { duration: outDuration }
		}
	}
})

// --------WIDTH-GROW------------------------------------------------------ //
export const widthGrow = (
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { scaleX: 0, opacity: initialOpacity },
	animate: {
		scaleX: 1,
		opacity: maxOpacity,
		transition: {
			scaleX: { duration: inDuration },
			opacity: { duration: inDuration }
		}
	},
	exit: {
		scaleX: 0,
		opacity: initialOpacity,
		transition: {
			scaleX: { duration: outDuration },
			opacity: { duration: outDuration }
		}
	}
})

export const widthGrowByPercent = (
	width: number = 100,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { width: 0, opacity: initialOpacity },
	animate: {
		width: `${width}%`,
		opacity: maxOpacity,
		transition: {
			width: { duration: inDuration },
			opacity: { duration: inDuration }
		}
	},
	exit: {
		width: 0,
		opacity: initialOpacity,
		transition: {
			width: { duration: outDuration },
			opacity: { duration: outDuration }
		}
	}
})

export const widthGrowByPx = (
	width: number,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { width: 0, opacity: initialOpacity },
	animate: {
		width: `${width}px`,
		opacity: maxOpacity,
		transition: {
			width: { duration: inDuration },
			opacity: { duration: inDuration }
		}
	},
	exit: {
		width: 0,
		opacity: initialOpacity,
		transition: {
			width: { duration: outDuration },
			opacity: { duration: outDuration }
		}
	}
})

// --------BOUNCY-WIDTH-GROW----------------------------------------------- //
export const bouncyWidthGrow = (
	maxScale: number = 1.1,
	maxAt: number = 0.75,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { scaleX: 0, opacity: initialOpacity },
	animate: {
		scaleX: [0, maxScale, 1],
		opacity: maxOpacity,
		transition: {
			scaleX: { duration: inDuration, times: [0, maxAt, 1] },
			opacity: { duration: inDuration }
		}
	},
	exit: {
		scaleX: [1, maxScale, 0],
		opacity: initialOpacity,
		transition: {
			scaleX: { duration: outDuration, times: [0, 1 - maxAt, 1] },
			opacity: { duration: outDuration }
		}
	}
})

export const bouncyWidthGrowByPercent = (
	width: number = 100,
	extraScale: number = 0.1,
	maxAt: number = 0.75,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { width: 0, opacity: initialOpacity },
	animate: {
		width: ['0%', `${width + width * extraScale}%`, `${width}%`],
		opacity: maxOpacity,
		transition: {
			width: { duration: inDuration, times: [0, maxAt, 1] },
			opacity: { duration: inDuration }
		}
	},
	exit: {
		width: [`${width}%`, `${width + width * extraScale}%`, '0%'],
		opacity: initialOpacity,
		transition: {
			width: { duration: outDuration, times: [0, 1 - maxAt, 1] },
			opacity: { duration: outDuration }
		}
	}
})

export const bouncyWidthGrowByPx = (
	width: number,
	extraScale: number = 0.1,
	maxAt: number = 0.75,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { width: 0, opacity: initialOpacity },
	animate: {
		width: ['0px', `${width + width * extraScale}px`, `${width}px`],
		opacity: maxOpacity,
		transition: {
			width: { duration: inDuration, times: [0, maxAt, 1] },
			opacity: { duration: inDuration }
		}
	},
	exit: {
		width: [`${width}px`, `${width + width * extraScale}px`, '0px'],
		opacity: initialOpacity,
		transition: {
			width: { duration: outDuration, times: [0, 1 - maxAt, 1] },
			opacity: { duration: outDuration }
		}
	}
})

// ------------------------------------------------------------------------ //
// --------POSITION-------------------------------------------------------- //
// ------------------------------------------------------------------------ //

// --------COME-FROM-BORDERS----------------------------------------------- //
export const comeFromCol = (
	comeFrom: number,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { opacity: initialOpacity, y: `${comeFrom}px` },
	animate: {
		opacity: maxOpacity,
		y: 0,
		transition: {
			opacity: { duration: inDuration },
			y: { duration: inDuration }
		}
	},
	exit: {
		opacity: initialOpacity,
		y: `${comeFrom}px`,
		transition: {
			opacity: { duration: outDuration },
			y: { duration: outDuration }
		}
	}
})

export const comeFromRow = (
	comeFrom: number,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { opacity: initialOpacity, x: `${comeFrom}px` },
	animate: {
		opacity: maxOpacity,
		x: 0,
		transition: {
			opacity: { duration: inDuration },
			x: { duration: inDuration }
		}
	},
	exit: {
		opacity: initialOpacity,
		x: `${comeFrom}px`,
		transition: {
			opacity: { duration: outDuration },
			x: { duration: outDuration }
		}
	}
})

// --------BOUNCY-COME-FROM-BORDERS---------------------------------------- //
export const bouncyComeFromCol = (
	comeFrom: number,
	bounce: number = 10,
	maxAt: number = 0.75,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { opacity: initialOpacity, y: `${comeFrom}px` },
	animate: {
		opacity: maxOpacity,
		y: [`${comeFrom}px`, `-${bounce}px`, '0px'],
		transition: {
			opacity: { duration: inDuration },
			y: { duration: inDuration, times: [0, maxAt, 1] }
		}
	},
	exit: {
		opacity: initialOpacity,
		y: ['0px', `-${bounce}px`, `${comeFrom}px`],
		transition: {
			opacity: { duration: outDuration },
			y: { duration: outDuration, times: [0, 1 - maxAt, 1] }
		}
	}
})

export const bouncyComeFromRow = (
	comeFrom: number,
	maxAt: number = 0.75,
	bounce: number = 10,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { opacity: initialOpacity, x: `${comeFrom}px` },
	animate: {
		opacity: maxOpacity,
		x: [`${comeFrom}px`, `-${bounce}px`, '0px'],
		transition: {
			opacity: { duration: inDuration },
			x: { duration: inDuration, times: [0, maxAt, 1] }
		}
	},
	exit: {
		opacity: initialOpacity,
		x: ['0px', `-${bounce}px`, `${comeFrom}px`],
		transition: {
			opacity: { duration: outDuration },
			x: { duration: outDuration, times: [0, 1 - maxAt, 1] }
		}
	}
})

// ------------------------------------------------------------------------ //
// --------FORM+POSITION--------------------------------------------------- //
// ------------------------------------------------------------------------ //

// --------GROWING-LIST---------------------------------------------------- //
export const growingListElem = (
	comeFrom: number,
	height: number,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { height: 0, y: `${comeFrom}px`, opacity: initialOpacity },
	animate: {
		height: `${height}px`,
		y: 0,
		opacity: maxOpacity,
		transition: {
			height: { duration: inDuration },
			y: { duration: inDuration },
			opacity: { duration: inDuration }
		}
	},
	exit: {
		height: 0,
		y: `${comeFrom}px`,
		opacity: initialOpacity,
		transition: {
			height: { duration: outDuration },
			y: { duration: inDuration },
			opacity: { duration: outDuration }
		}
	}
})

// --------BOUNCY-GROWING-LIST--------------------------------------------- //
export const bouncyGrowingListElem = (
	comeFrom: number,
	height: number,
	extraScale: number = 0.1,
	maxAt: number = 0.75,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { height: 0, y: `${comeFrom}px`, opacity: initialOpacity },
	animate: {
		height: ['0px', `${height + height * extraScale}px`, `${height}px`],
		y: [`${comeFrom}px`, `-${height * 0.05}px`, '0px'],
		opacity: maxOpacity,
		transition: {
			height: { duration: inDuration, times: [0, maxAt, 1] },
			y: { duration: inDuration, times: [0, maxAt, 1] },
			opacity: { duration: inDuration }
		}
	},
	exit: {
		height: [`${height}px`, `${height + height * extraScale}px`, '0px'],
		y: ['0px', `-${height * 0.05}px`, `${comeFrom}px`],
		opacity: initialOpacity,
		transition: {
			height: { duration: outDuration, times: [0, 1 - maxAt, 1] },
			y: { duration: inDuration, times: [0, 1 - maxAt, 1] },
			opacity: { duration: outDuration }
		}
	}
})