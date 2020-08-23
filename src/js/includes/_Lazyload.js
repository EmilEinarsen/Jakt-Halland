function Lazyload() {
	let images = [...queryTargetAll('.lazy')]
	loadImage = image => image.classList.remove("lazy")

	this.load = () => {
		tools.throttle(() => {
			if(!images.length) removeObserver()
			images = images.filter(image => validate.isInWindow(image) ? loadImage(image) : image)
		}, 17)
	}
	removeObserver = () => {
		document.removeEventListener("scroll", this.load)
		window.removeEventListener("resize", this.load)
		window.removeEventListener("orientationChange", this.load)
	}
}