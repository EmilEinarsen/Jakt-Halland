import {queryTargetAll} from './helpers'

export default function Lazyload() {

	let images = queryTargetAll(".lazy")
	const loadImage = image => image.classList.remove("lazy")
	const isImagesLoaded = () => images.length === 0

	this.lazyload = () => {
		tools.throttle(load)
	}
	const load = () => {
		images = [...images].filter(image => {
			if(screenState.isInWindow(image)) loadImage(image)
			else return image
		})
		if(isImagesLoaded()) removeObserver()
	}
	const removeObserver = () => {
		document.removeEventListener("scroll", this.lazyload)
		window.removeEventListener("resize", this.lazyload)
		window.removeEventListener("orientationChange", this.lazyload)
	}
}