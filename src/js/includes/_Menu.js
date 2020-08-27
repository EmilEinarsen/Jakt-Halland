function Menu() {
	const navbar = queryTarget('nav')
	
	this.toggle = () => {
		navbar.classList.toggle('open')
		if(validate.isWidthMobile()) scroll.toggleScroll()
	}
	this.close = () => {
		scroll.enable()
		if(!validate.isMenuOpen()) return
		navbar.classList.remove('open')
	}
	this.toggleNavbarVisiblity = e => {
		if(!validate.shouldNavbarVisibiltyToggle(e)) return
		let isScrollingUp = scroll.direction()
		this.close()
		isScrollingUp ? this.addNavbarVisible() : this.removeNavbarVisible()
	}
	this.toggleNavbarTransparency = () => {
		console.log(scroll.getPositionY())
		tools.getScreenHeight() <= 750 && scroll.getPositionY() < 50 ? menu.removeNavbarTransparent() : menu.addNavbarTransparent()
	}
	this.addNavbarVisible = () => navbar.classList.add('visible')
	this.removeNavbarVisible = () => navbar.classList.remove('visible')
	this.addNavbarTransparent = () => navbar.classList.add('transparent')
	this.removeNavbarTransparent = () => navbar.classList.remove('transparent')
}
