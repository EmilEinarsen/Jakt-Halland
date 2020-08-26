function Scroll() {
	let y
	let oldScroll
	this.setOldScroll = () => oldScroll = this.getPositionY()
	this.getPositionY = () => window.scrollY

	this.toggleScroll = () => {
		validate.isMenuOpen() ? this.disable() : this.enable()
	}
	this.disable = () => {
		y = this.getPositionY()
		page.setVerticlePositionOfBody(y)
		queryTarget('body').classList.add('stop-scrolling')
	}
	this.enable = () => {
		if(!validate.isScrollingDisabled()) return
		page.removeVerticlePositionOfBody()
		queryTarget('body').classList.remove('stop-scrolling')
		console.log(y)
		this.scrollToInstantly({top: y})
	}
	this.direction = () => {
		const scrollingUp = oldScroll > this.getPositionY()
		this.setOldScroll()
		return scrollingUp
	}

	this.keepYPosition = func => {
		y = this.getPositionY()
		func()
		this.scrollToInstantly({top: y})
	}

	this.scrollToParameter = (param) => {
		validate.setIsScrollingManual(false)
		const yOffset = -120
		let y = queryTarget(param).getBoundingClientRect().top + window.pageYOffset + yOffset
		window.scrollTo({top: y, behavior: 'smooth'})
	}
	this.scrollToTop = () => window.scrollTo({top: 0, behavior: 'smooth'})
	this.scrollToBottom = () => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})
	this.scrollToInstantly = param => window.scrollTo(param)
}