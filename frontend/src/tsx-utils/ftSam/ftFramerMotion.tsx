// ------------------------------------------------------------------------ //
// --------ELEMENTS-------------------------------------------------------- //
// ------------------------------------------------------------------------ //

// --------FADE------------------------------------------------------------ //
interface fadeProps {
	initialOpacity?: number
	maxOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const fade = ({
	initialOpacity = 0,
	maxOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: fadeProps) => ({
	initial: { opacity: initialOpacity },
	animate: {
		opacity: maxOpacity,
		transition: { opacity: { duration: inDuration, ease: animateEase } }
	},
	exit: {
		opacity: initialOpacity,
		transition: { opacity: { duration: outDuration, ease: exitEase } }
	}
})


// ------------------------------------------------------------------------ //
// --------FORM------------------------------------------------------------ //
// ------------------------------------------------------------------------ //

// --------POP------------------------------------------------------------- //
interface popByScaleProps {
	initialScale?: number
	maxScale?: number
	initialOpacity?: number
	maxOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const popByScale = ({
	initialScale = 0,
	maxScale = 1,
	initialOpacity = 0,
	maxOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: popByScaleProps) => ({
	initial: { scale: initialScale, opacity: initialOpacity },
	animate: {
		scale: maxScale,
		opacity: maxOpacity,
		transition: {
			scale: { duration: inDuration, ease: animateEase },
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		scale: initialScale,
		opacity: initialOpacity,
		transition: {
			scale: { duration: outDuration, ease: exitEase },
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

interface popByPercentProps {
	initialWidth?: number
	initialHeight?: number
	maxWidth?: number
	maxHeight?: number
	initialOpacity?: number
	maxOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const popByPercent = ({
	initialWidth = 0,
	initialHeight = 0,
	maxWidth = 100,
	maxHeight = 100,
	initialOpacity = 0,
	maxOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: popByPercentProps) => ({
	initial: { width: initialWidth, height: initialHeight, opacity: initialOpacity },
	animate: {
		width: `${maxWidth}%`,
		height: `${maxHeight}%`,
		opacity: maxOpacity,
		transition: {
			width: { duration: inDuration, ease: animateEase },
			height: { duration: inDuration, ease: animateEase },
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		width: initialWidth,
		height: initialHeight,
		opacity: initialOpacity,
		transition: {
			width: { duration: outDuration, ease: exitEase },
			height: { duration: outDuration, ease: exitEase },
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

interface popByPxProps {
	initialWidth?: number
	initialHeight?: number
	maxWidth: number
	maxHeight: number
	initialOpacity?: number
	maxOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const popByPx = ({
	initialWidth = 0,
	initialHeight = 0,
	maxWidth,
	maxHeight,
	initialOpacity = 0,
	maxOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: popByPxProps) => ({
	initial: { width: initialWidth, height: initialHeight, opacity: initialOpacity },
	animate: {
		width: `${maxWidth}px`,
		height: `${maxHeight}px`,
		opacity: maxOpacity,
		transition: {
			width: { duration: inDuration, ease: animateEase },
			height: { duration: inDuration, ease: animateEase },
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		width: initialWidth,
		height: initialHeight,
		opacity: initialOpacity,
		transition: {
			width: { duration: outDuration, ease: exitEase },
			height: { duration: outDuration, ease: exitEase },
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

// --------BOUNCY-POP-UP--------------------------------------------------- //
interface bouncyPopByScaleProps {
	initialScale?: number
	maxScale?: number
	finalScale?: number
	maxScaleAt?: number
	initialOpacity?: number
	maxOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const bouncyPopByScale = ({
	initialScale = 0,
	maxScale = 1.2,
	finalScale = 1,
	maxScaleAt = 0.75,
	initialOpacity = 0,
	maxOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: bouncyPopByScaleProps) => ({
	initial: { scale: initialScale, opacity: initialOpacity },
	animate: {
		scale: [initialScale, maxScale, finalScale],
		opacity: maxOpacity,
		transition: {
			scale: {
				duration: inDuration,
				times: [0, maxScaleAt, 1],
				ease: animateEase
			},
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		scale: [finalScale, maxScale, initialScale],
		opacity: initialOpacity,
		transition: {
			scale: {
				duration: outDuration,
				times: [0, 1 - maxScaleAt, 1],
				ease: exitEase
			},
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

interface bouncyPopByPercentProps {
	initialWidth?: number
	initialHeight?: number
	maxWidth?: number
	maxHeight?: number
	initialOpacity?: number
	maxOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const bouncyPopByPercent = ({
	initialWidth = 0,
	initialHeight = 0,
	maxWidth = 100,
	maxHeight = 100,
	initialOpacity = 0,
	maxOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: popByPercentProps) => ({
	initial: { width: 0, height: 0, opacity: initialOpacity },
	animate: {
		width: ['0%', `${width + width * extraScale}%`, `${width}%`],
		height: ['0%', `${height + height * extraScale}%`, `${height}%`],
		opacity: maxOpacity,
		transition: {
			width: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			height: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		width: [`${width}%`, `${width + width * extraScale}%`, '0%'],
		height: [`${height}%`, `${height + height * extraScale}%`, '0%'],
		opacity: initialOpacity,
		transition: {
			width: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			height: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

export const bouncyPopByPx = (
	width: number,
	height: number,
	extraScale: number = 0.2,
	maxAt: number = 0.75,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
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
			width: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			height: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		width: [`${width}px`, `${width + width * extraScale}px`, '0px'],
		height: [`${height}px`, `${height + height * extraScale}px`, '0px'],
		opacity: initialOpacity,
		transition: {
			width: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			height: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

// --------HEIGHT-GROW----------------------------------------------------- //
export const heightGrow = (
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
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
			scaleY: { duration: inDuration, ease: animateEase },
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		scaleY: 0,
		opacity: initialOpacity,
		transition: {
			scaleY: { duration: outDuration, ease: exitEase },
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

export const heightGrowByPercent = (
	height: number = 100,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
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
			height: { duration: inDuration, ease: animateEase },
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		height: 0,
		opacity: initialOpacity,
		transition: {
			height: { duration: outDuration, ease: exitEase },
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

export const heightGrowByPx = (
	height: number,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
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
			height: { duration: inDuration, ease: animateEase },
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		height: 0,
		opacity: initialOpacity,
		transition: {
			height: { duration: outDuration, ease: exitEase },
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

// --------BOUNCY-HEIGHT-GROW---------------------------------------------- //
export const bouncyHeightGrow = (
	maxScale: number = 1.1,
	maxAt: number = 0.75,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
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
			scaleY: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		scaleY: [1, maxScale, 0],
		opacity: initialOpacity,
		transition: {
			scaleY: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

export const bouncyHeightGrowByPercent = (
	height: number = 100,
	extraScale: number = 0.2,
	maxAt: number = 0.75,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { height: 0, opacity: initialOpacity },
	animate: {
		height: ['0%', `${height + height * extraScale}%`, `${height}%`],
		opacity: maxOpacity,
		transition: {
			height: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: { duration: inDuration, ease: animateEase },
		}
	},
	exit: {
		height: [`${height}%`, `${height + height * extraScale}%`, '0%'],
		opacity: initialOpacity,
		transition: {
			height: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: { duration: outDuration, ease: exitEase },
		}
	}
})

export const bouncyHeightGrowByPx = (
	height: number,
	extraScale: number = 0.2,
	maxAt: number = 0.75,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
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
			height: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		height: [`${height}px`, `${height + height * extraScale}px`, '0px'],
		opacity: initialOpacity,
		transition: {
			height: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

// --------WIDTH-GROW------------------------------------------------------ //
export const widthGrow = (
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
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
			scaleX: { duration: inDuration, ease: animateEase },
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		scaleX: 0,
		opacity: initialOpacity,
		transition: {
			scaleX: { duration: outDuration, ease: exitEase },
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

export const widthGrowByPercent = (
	width: number = 100,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
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
			width: { duration: inDuration, ease: animateEase },
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		width: 0,
		opacity: initialOpacity,
		transition: {
			width: { duration: outDuration, ease: exitEase },
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

export const widthGrowByPx = (
	width: number,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
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
			width: { duration: inDuration, ease: animateEase },
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		width: 0,
		opacity: initialOpacity,
		transition: {
			width: { duration: outDuration, ease: exitEase },
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

// --------BOUNCY-WIDTH-GROW----------------------------------------------- //
export const bouncyWidthGrow = (
	maxScale: number = 1.1,
	maxAt: number = 0.75,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
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
			scaleX: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		scaleX: [1, maxScale, 0],
		opacity: initialOpacity,
		transition: {
			scaleX: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

export const bouncyWidthGrowByPercent = (
	width: number = 100,
	extraScale: number = 0.2,
	maxAt: number = 0.75,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1,
) => ({
	initial: { width: 0, opacity: initialOpacity },
	animate: {
		width: ['0%', `${width + width * extraScale}%`, `${width}%`],
		opacity: maxOpacity,
		transition: {
			width: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		width: [`${width}%`, `${width + width * extraScale}%`, '0%'],
		opacity: initialOpacity,
		transition: {
			width: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

export const bouncyWidthGrowByPx = (
	width: number,
	extraScale: number = 0.2,
	maxAt: number = 0.75,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
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
			width: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		width: [`${width}px`, `${width + width * extraScale}px`, '0px'],
		opacity: initialOpacity,
		transition: {
			width: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

// ------------------------------------------------------------------------ //
// --------POSITION-------------------------------------------------------- //
// ------------------------------------------------------------------------ //

// --------COME-FROM-BORDERS----------------------------------------------- //
export const comeFromCol = (
	comeFrom: number,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
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
			opacity: { duration: inDuration, ease: animateEase },
			y: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		opacity: initialOpacity,
		y: `${comeFrom}px`,
		transition: {
			opacity: { duration: outDuration, ease: exitEase },
			y: { duration: outDuration, ease: exitEase }
		}
	}
})

export const comeFromRow = (
	comeFrom: number,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
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
			opacity: { duration: inDuration, ease: animateEase },
			x: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		opacity: initialOpacity,
		x: `${comeFrom}px`,
		transition: {
			opacity: { duration: outDuration, ease: exitEase },
			x: { duration: outDuration, ease: exitEase }
		}
	}
})

// --------BOUNCY-COME-FROM-BORDERS---------------------------------------- //
export const bouncyComeFromCol = (
	comeFrom: number,
	bounce: number = 10,
	maxAt: number = 0.75,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
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
			opacity: { duration: inDuration, ease: animateEase },
			y: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			}
		}
	},
	exit: {
		opacity: initialOpacity,
		y: ['0px', `-${bounce}px`, `${comeFrom}px`],
		transition: {
			opacity: { duration: outDuration, ease: exitEase },
			y: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			}
		}
	}
})

export const bouncyComeFromRow = (
	comeFrom: number,
	maxAt: number = 0.75,
	bounce: number = 10,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
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
			opacity: { duration: inDuration, ease: animateEase },
			x: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			}
		}
	},
	exit: {
		opacity: initialOpacity,
		x: ['0px', `-${bounce}px`, `${comeFrom}px`],
		transition: {
			opacity: { duration: outDuration, ease: exitEase },
			x: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			}
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
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
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
			height: { duration: inDuration, ease: animateEase },
			y: { duration: inDuration, ease: animateEase },
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		height: 0,
		y: `${comeFrom}px`,
		opacity: initialOpacity,
		transition: {
			height: { duration: outDuration, ease: exitEase },
			y: { duration: outDuration, ease: exitEase },
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

// --------BOUNCY-GROWING-LIST--------------------------------------------- //
export const bouncyGrowingListElem = (
	comeFrom: number,
	height: number,
	extraScale: number = 0.2,
	maxAt: number = 0.75,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
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
			height: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			y: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		height: [`${height}px`, `${height + height * extraScale}px`, '0px'],
		y: ['0px', `-${height * 0.05}px`, `${comeFrom}px`],
		opacity: initialOpacity,
		transition: {
			height: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			y: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})