// ------------------------------------------------------------------------ //
// --------ELEMENTS-------------------------------------------------------- //
// ------------------------------------------------------------------------ //

// --------OPACITY--------------------------------------------------------- //
interface fadeProps {
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const fade = ({
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: fadeProps) => ({
	initial: { opacity: initialOpacity },
	animate: {
		opacity: finalOpacity,
		transition: {
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		opacity: initialOpacity,
		transition: {
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

// ------------------------------------------------------------------------ //
// --------FORM------------------------------------------------------------ //
// ------------------------------------------------------------------------ //

// --------WIDTH----------------------------------------------------------- //
interface widthChangeProps {
	initialWidth?: number
	finalWidth?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const widthChange = ({
	initialWidth = 0,
	finalWidth = 1,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: widthChangeProps) => ({
	initial: {
		scaleX: initialWidth,
		opacity: initialOpacity
	},
	animate: {
		scaleX: finalWidth,
		opacity: finalOpacity,
		transition: {
			scaleX: {
				duration: inDuration,
				ease: animateEase
			},
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		scaleX: initialWidth,
		opacity: initialOpacity,
		transition: {
			scaleX: {
				duration: outDuration,
				ease: exitEase
			},
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

interface widthChangeByPercentProps {
	initialWidth?: number
	finalWidth?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const widthChangeByPercent = ({
	initialWidth = 0,
	finalWidth = 100,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: widthChangeByPercentProps) => ({
	initial: {
		width: `${initialWidth}%`,
		opacity: initialOpacity
	},
	animate: {
		width: `${finalWidth}%`,
		opacity: finalOpacity,
		transition: {
			width: {
				duration: inDuration,
				ease: animateEase
			},
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		width: `${initialWidth}%`,
		opacity: initialOpacity,
		transition: {
			width: {
				duration: outDuration,
				ease: exitEase
			},
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

interface widthChangeByPxProps {
	initialWidth?: number
	finalWidth: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const widthChangeByPx = ({
	initialWidth = 0,
	finalWidth,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: widthChangeByPxProps) => ({
	initial: {
		width: `${initialWidth}px`,
		opacity: initialOpacity
	},
	animate: {
		width: `${finalWidth}px`,
		opacity: finalOpacity,
		transition: {
			width: {
				duration: inDuration,
				ease: animateEase
			},
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		width: `${initialWidth}px`,
		opacity: initialOpacity,
		transition: {
			width: {
				duration: outDuration,
				ease: exitEase
			},
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

// --------WIDTH+BOUNCE---------------------------------------------------- //
interface bouncyWidthChangeProps {
	initialWidth?: number
	finalWidth?: number
	maxWidth?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const bouncyWidthChange = ({
	initialWidth = 0,
	finalWidth = 1,
	maxWidth = finalWidth * 1.2,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: bouncyWidthChangeProps) => ({
	initial: {
		scaleX: initialWidth,
		opacity: initialOpacity
	},
	animate: {
		scaleX: [initialWidth, maxWidth, finalWidth],
		opacity: finalOpacity,
		transition: {
			scaleX: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		scaleX: [finalWidth, maxWidth, initialWidth],
		opacity: initialOpacity,
		transition: {
			scaleX: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

interface bouncyWidthChangeByPercentProps {
	initialWidth?: number
	finalWidth?: number
	maxWidth?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const bouncyWidthChangeByPercent = ({
	initialWidth = 0,
	finalWidth = 100,
	maxWidth = finalWidth * 1.2,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: bouncyWidthChangeByPercentProps) => ({
	initial: {
		width: `${initialWidth}%`,
		opacity: initialOpacity
	},
	animate: {
		width: [`${initialWidth}%`, `${maxWidth}%`, `${finalWidth}%`],
		opacity: finalOpacity,
		transition: {
			width: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		width: [`${finalWidth}%`, `${maxWidth}%`, `${initialWidth}%`],
		opacity: initialOpacity,
		transition: {
			width: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

interface bouncyWidthChangeByPxProps {
	initialWidth?: number
	finalWidth: number
	maxWidth?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const bouncyWidthChangeByPx = ({
	initialWidth = 0,
	finalWidth,
	maxWidth = finalWidth * 1.2,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: bouncyWidthChangeByPxProps) => ({
	initial: {
		width: `${initialWidth}px`,
		opacity: initialOpacity
	},
	animate: {
		width: [`${initialWidth}px`, `${maxWidth}px`, `${finalWidth}px`],
		opacity: finalOpacity,
		transition: {
			width: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		width: [`${finalWidth}px`, `${maxWidth}px`, `${initialWidth}px`],
		opacity: initialOpacity,
		transition: {
			width: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

// --------HEIGHT---------------------------------------------------------- //
interface heightChangeProps {
	initialHeight?: number
	finalHeight?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const heightChange = ({
	initialHeight = 0,
	finalHeight = 1,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: heightChangeProps) => ({
	initial: {
		scaleY: initialHeight,
		opacity: initialOpacity
	},
	animate: {
		scaleY: finalHeight,
		opacity: finalOpacity,
		transition: {
			scaleY: {
				duration: inDuration,
				ease: animateEase
			},
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		scaleY: initialHeight,
		opacity: initialOpacity,
		transition: {
			scaleY: {
				duration: outDuration,
				ease: exitEase
			},
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

interface heightChangeByPercentProps {
	initialHeight?: number
	finalHeight?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const heightChangeByPercent = ({
	initialHeight = 0,
	finalHeight = 100,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: heightChangeByPercentProps) => ({
	initial: {
		height: `${initialHeight}%`,
		opacity: initialOpacity
	},
	animate: {
		height: `${finalHeight}%`,
		opacity: finalOpacity,
		transition: {
			height: {
				duration: inDuration,
				ease: animateEase
			},
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		height: `${initialHeight}%`,
		opacity: initialOpacity,
		transition: {
			height: {
				duration: outDuration,
				ease: exitEase
			},
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

interface heightChangeByPxProps {
	initialHeight?: number
	finalHeight: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const heightChangeByPx = ({
	initialHeight = 0,
	finalHeight,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: heightChangeByPxProps) => ({
	initial: {
		height: `${initialHeight}px`,
		opacity: initialOpacity
	},
	animate: {
		height: `${finalHeight}px`,
		opacity: finalOpacity,
		transition: {
			height: {
				duration: inDuration,
				ease: animateEase
			},
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		height: `${initialHeight}px`,
		opacity: initialOpacity,
		transition: {
			height: {
				duration: outDuration,
				ease: exitEase
			},
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

// --------HEIGHT+BOUNCE--------------------------------------------------- //
interface bouncyHeightChangeProps {
	initialHeight?: number
	finalHeight?: number
	maxHeight?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const bouncyHeightChange = ({
	initialHeight = 0,
	finalHeight = 1,
	maxHeight = finalHeight * 1.2,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: bouncyHeightChangeProps) => ({
	initial: {
		scaleY: initialHeight,
		opacity: initialOpacity
	},
	animate: {
		scaleY: [initialHeight, maxHeight, finalHeight],
		opacity: finalOpacity,
		transition: {
			scaleY: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		scaleY: [finalHeight, maxHeight, initialHeight],
		opacity: initialOpacity,
		transition: {
			scaleY: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

interface bouncyHeightChangeByPercentProps {
	initialHeight?: number
	finalHeight?: number
	maxHeight?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const bouncyHeightChangeByPercent = ({
	initialHeight = 0,
	finalHeight = 100,
	maxHeight = finalHeight * 1.2,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: bouncyHeightChangeByPercentProps) => ({
	initial: {
		height: `${initialHeight}%`,
		opacity: initialOpacity
	},
	animate: {
		height: [`${initialHeight}%`, `${maxHeight}%`, `${finalHeight}%`],
		opacity: finalOpacity,
		transition: {
			height: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		height: [`${finalHeight}%`, `${maxHeight}%`, `${initialHeight}%`],
		opacity: initialOpacity,
		transition: {
			height: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

interface bouncyHeightChangeByPxProps {
	initialHeight?: number
	finalHeight: number
	maxHeight?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const bouncyHeightChangeByPx = ({
	initialHeight = 0,
	finalHeight,
	maxHeight = finalHeight * 1.2,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: bouncyHeightChangeByPxProps) => ({
	initial: {
		height: `${initialHeight}px`,
		opacity: initialOpacity
	},
	animate: {
		height: [`${initialHeight}px`, `${maxHeight}px`, `${finalHeight}px`],
		opacity: finalOpacity,
		transition: {
			height: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		height: [`${finalHeight}px`, `${maxHeight}px`, `${initialHeight}px`],
		opacity: initialOpacity,
		transition: {
			height: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

// --------POP-UP---------------------------------------------------------- //
interface popUpProps {
	initialSize?: number
	finalSize?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const popUp = ({
	initialSize = 0,
	finalSize = 1,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: popUpProps) => ({
	initial: {
		scale: initialSize,
		opacity: initialOpacity
	},
	animate: {
		scale: finalSize,
		opacity: finalOpacity,
		transition: {
			scale: {
				duration: inDuration,
				ease: animateEase
			},
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		scale: initialSize,
		opacity: initialOpacity,
		transition: {
			scale: {
				duration: outDuration,
				ease: exitEase
			},
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

interface popUpByPercentProps {
	initialWidth?: number
	finalWidth?: number
	maxWidth?: number
	initialHeight?: number
	finalHeight?: number
	maxHeight?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const popUpByPercent = ({
	initialWidth = 0,
	finalWidth = 100,
	initialHeight = 0,
	finalHeight = 100,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: popUpByPercentProps) => ({
	initial: {
		width: `${initialWidth}%`,
		height: `${initialHeight}%`,
		opacity: initialOpacity
	},
	animate: {
		width: `${finalWidth}%`,
		height: `${finalHeight}%`,
		opacity: finalOpacity,
		transition: {
			width: {
				duration: inDuration,
				ease: animateEase
			},
			height: {
				duration: inDuration,
				ease: animateEase
			},
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		width: `${initialWidth}%`,
		height: `${initialHeight}%`,
		opacity: initialOpacity,
		transition: {
			width: {
				duration: outDuration,
				ease: exitEase
			},
			height: {
				duration: outDuration,
				ease: exitEase
			},
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

interface popUpByPxProps {
	initialWidth?: number
	finalWidth: number
	initialHeight?: number
	finalHeight: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const popUpByPx = ({
	initialWidth = 0,
	finalWidth,
	initialHeight = 0,
	finalHeight,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: popUpByPxProps) => ({
	initial: {
		width: `${initialWidth}px`,
		height: `${initialHeight}px`,
		opacity: initialOpacity
	},
	animate: {
		width: `${finalWidth}px`,
		height: `${finalHeight}px`,
		opacity: finalOpacity,
		transition: {
			width: {
				duration: inDuration,
				ease: animateEase
			},
			height: {
				duration: inDuration,
				ease: animateEase
			},
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		width: `${initialWidth}px`,
		height: `${initialHeight}px`,
		opacity: initialOpacity,
		transition: {
			width: {
				duration: outDuration,
				ease: exitEase
			},
			height: {
				duration: outDuration,
				ease: exitEase
			},
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

// --------BOUNCY-POP-UP--------------------------------------------------- //
interface bouncyPopUpProps {
	initialSize?: number
	finalSize?: number
	maxSize?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const bouncyPopUp = ({
	initialSize = 0,
	finalSize = 1,
	maxSize = finalSize * 1.2,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: bouncyPopUpProps) => ({
	initial: {
		scale: initialSize,
		opacity: initialOpacity
	},
	animate: {
		scale: [initialSize, maxSize, finalSize],
		opacity: finalOpacity,
		transition: {
			scale: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		scale: [finalSize, maxSize, initialSize],
		opacity: initialOpacity,
		transition: {
			scale: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

interface bouncyPopUpByPercentProps {
	initialWidth?: number
	finalWidth?: number
	maxWidth?: number
	initialHeight?: number
	finalHeight?: number
	maxHeight?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const bouncyPopUpByPercent = ({
	initialWidth = 0,
	finalWidth = 100,
	maxWidth = finalWidth * 1.2,
	initialHeight = 0,
	finalHeight = 100,
	maxHeight = finalHeight * 1.2,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: bouncyPopUpByPercentProps) => ({
	initial: {
		width: `${initialWidth}%`,
		height: `${initialHeight}%`,
		opacity: initialOpacity
	},
	animate: {
		width: [`${initialWidth}%`, `${maxWidth}%`, `${finalWidth}%`],
		height: [`${initialHeight}%`, `${maxHeight}%`, `${finalHeight}%`],
		opacity: finalOpacity,
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
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		width: [`${finalWidth}%`, `${maxWidth}%`, `${initialWidth}%`],
		height: [`${finalHeight}%`, `${maxHeight}%`, `${initialHeight}%`],
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
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

interface bouncyPopUpByPxProps {
	initialWidth?: number
	finalWidth: number
	maxWidth?: number
	initialHeight?: number
	finalHeight: number
	maxHeight?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const bouncyPopUpByPx = ({
	initialWidth = 0,
	finalWidth,
	maxWidth = finalWidth * 1.2,
	initialHeight = 0,
	finalHeight,
	maxHeight = finalHeight * 1.2,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: bouncyPopUpByPxProps) => ({
	initial: {
		width: `${initialWidth}px`,
		height: `${initialHeight}px`,
		opacity: initialOpacity
	},
	animate: {
		width: [`${initialWidth}px`, `${maxWidth}px`, `${finalWidth}px`],
		height: [`${initialHeight}px`, `${maxHeight}px`, `${finalHeight}px`],
		opacity: finalOpacity,
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
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		width: [`${finalWidth}px`, `${maxWidth}px`, `${initialWidth}px`],
		height: [`${finalHeight}px`, `${maxHeight}px`, `${initialHeight}px`],
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
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

// ------------------------------------------------------------------------ //
// --------POSITION-------------------------------------------------------- //
// ------------------------------------------------------------------------ //

// --------Y-MOVE---------------------------------------------------------- //
interface yMoveProps {
	from?: number
	to?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const yMove = ({
	from = -100,
	to = 0,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: yMoveProps) => ({
	initial: {
		y: `${from}px`,
		opacity: initialOpacity
	},
	animate: {
		y: `${to}px`,
		opacity: finalOpacity,
		transition: {
			y: {
				duration: inDuration,
				ease: animateEase
			},
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		y: `${from}px`,
		opacity: initialOpacity,
		transition: {
			y: {
				duration: outDuration,
				ease: exitEase
			},
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

// --------Y-MOVE+BOUNCE--------------------------------------------------- //
interface bouncyYMoveProps {
	from?: number
	to?: number
	extra?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const bouncyYMove = ({
	from = -100,
	to = 0,
	extra = to + 10,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: bouncyYMoveProps) => ({
	initial: {
		y: `${from}px`,
		opacity: initialOpacity
	},
	animate: {
		y: [`${from}px`, `${extra}px`, `${to}px`],
		opacity: finalOpacity,
		transition: {
			y: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		y: [`${to}px`, `${extra}px`, `${from}px`],
		opacity: initialOpacity,
		transition: {
			y: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

// --------X-MOVE---------------------------------------------------------- //
interface xMoveProps {
	from?: number
	to?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const xMove = ({
	from = -100,
	to = 0,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: xMoveProps) => ({
	initial: {
		x: `${from}px`,
		opacity: initialOpacity
	},
	animate: {
		x: `${to}px`,
		opacity: finalOpacity,
		transition: {
			x: {
				duration: inDuration,
				ease: animateEase
			},
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		x: `${from}px`,
		opacity: initialOpacity,
		transition: {
			x: {
				duration: outDuration,
				ease: exitEase
			},
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

// --------X-MOVE+BOUNCE--------------------------------------------------- //
interface bouncyXMoveProps {
	from?: number
	to?: number
	extra?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const bouncyXMove = ({
	from = -100,
	to = 0,
	extra = to + 10,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: bouncyXMoveProps) => ({
	initial: {
		x: `${from}px`,
		opacity: initialOpacity
	},
	animate: {
		x: [`${from}px`, `${extra}px`, `${to}px`],
		opacity: finalOpacity,
		transition: {
			x: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		x: [`${to}px`, `${extra}px`, `${from}px`],
		opacity: initialOpacity,
		transition: {
			x: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

// ------------------------------------------------------------------------ //
// --------MOTION-FUSION--------------------------------------------------- //
// ------------------------------------------------------------------------ //
interface MotionProps {
	initial: any;
	animate: any;
	exit: any;
}
export const mergeMotions = (...motions: MotionProps[]): MotionProps => (
	motions.reduce((current: MotionProps, accumulator: MotionProps) => ({
		initial: {
			...current.initial,
			...accumulator.initial
		},
		animate: {
			...current.animate,
			...accumulator.animate,
			transition: {
				...current.animate.transition,
				...accumulator.animate.transition,
			}
		},
		exit: {
			...accumulator.exit,
			...current.exit,
			transition: {
				...accumulator.exit.transition,
				...current.exit.transition
			}
		}
	}), {
		initial: {},
		animate: { transition: {} },
		exit: { transition: {} },
	})
)